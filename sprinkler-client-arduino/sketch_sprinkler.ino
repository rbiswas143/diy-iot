#include <ArduinoJson.h>
#include <ArduinoHttpClient.h>
#include <ESP8266WiFi.h>

// Loop
int loop_interval = 5000; // ms

// WiFi
const char* wifi_ssid = "";
const char* wifi_pswd = "";

// Sever
const char* server_uname = "API_KEY";
const char* server_pswd = "";
char* server_ip = "192.168.1.8";
const int server_port = 8000;

// Valve
const int valve_pin = 0;
volatile int valve_state = 0;
volatile int valve_job_id = NULL;

// Flow Sensor
const int flow_pin = 2;
const int pulses_per_litre = 365;
const float min_volume_save_threshold = 0.1; // Litres
const int max_duration_save_threshold = 60 * 60; // Seconds
volatile int pulse_count = 0;
unsigned long last_read_time;

// HTTP client config
WiFiClient wifi;
HttpClient client = HttpClient(wifi, server_ip, server_port);
int status = WL_IDLE_STATUS;

// Increments pulse count on interrupt
void record_pulse() {
  pulse_count++;
  if (pulse_count % 100 == 0) {
    Serial.print("Pulse Count: ");
    Serial.println(pulse_count);
  }
}

void flow_sensor_tasks() {

  // Compute flow and duration
  unsigned long curr_time = millis();
  Serial.print("Curr Time: ");
  Serial.println(curr_time);
  Serial.print("Last read time: ");
  Serial.println(last_read_time);
  float duration = (float)(curr_time - last_read_time) / 1000;
  int recorded_pulses = pulse_count;
  float volume = ((float) recorded_pulses) / pulses_per_litre;
  Serial.print("Flow recorded:\nDuration: ");
  Serial.println(duration);
  Serial.print("Recorded Pulses: ");
  Serial.println(recorded_pulses);
  Serial.print("Volume: ");
  Serial.println(volume);

  // Check threshods for saving
  if (volume < min_volume_save_threshold && duration < max_duration_save_threshold) {
    Serial.println("Thresholds not satisfied");
    return;
  }

  // Generate JOSN save request body
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["volume"] = volume;
  root["duration"] = duration;
  Serial.print("Sending data to server: ");
  root.printTo(Serial);
  Serial.println();

  // Save flow info
  client.beginRequest();
  client.post("/flow");
  client.sendHeader(HTTP_HEADER_CONTENT_TYPE, "application/json");
  client.sendHeader(HTTP_HEADER_CONTENT_LENGTH, root.measureLength());
  client.sendBasicAuth(server_uname, server_pswd);
  client.endRequest();
  root.printTo(client);

  int resp_code = client.responseStatusCode();
  String resp_body = client.responseBody();
  if (resp_code == 200) {
    pulse_count -= recorded_pulses;
    last_read_time = curr_time;
    Serial.print("Reset pulse to ");
    Serial.println(pulse_count);
  } else {
    Serial.print("Failed to save flow data.\nResponse Code:");
    Serial.println(resp_code);
    Serial.print("Response:");
    Serial.println(resp_body);
  }
}

void valve_tasks() {
  Serial.println("Fetching valve state");
  client.beginRequest();
  client.get("/valve");
  client.sendBasicAuth(server_uname, server_pswd);
  client.endRequest();

  // Read the status code and body of the response
  int resp_code = client.responseStatusCode();
  String resp_body = client.responseBody();
  Serial.print("Response code: ");
  Serial.println(resp_code);
  Serial.print("Response: ");
  Serial.println(resp_body);

  // Parse body as json
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(resp_body);
  if (!root.success()) {
    Serial.println("parseObject() failed");
  } else {
    int orig_state = valve_state;
    int orig_job_id = valve_job_id;
    int state = root["state"];
    int job_id = root["id"];
    Serial.print("Valve State: ");
    Serial.println(state);
    Serial.print("Job ID: ");
    Serial.println(job_id);

    if (orig_state == state && orig_job_id == job_id) { 
      Serial.println("Valve state need not be changed. Ending valve update loop.");
      return;
    }

    // Switch the valve
    change_valve_state(state, job_id);

    // Send valve update success
    if (job_id == NULL) {
      Serial.println("Job ID is NULL. No need to send update status to server");
      return; 
    }
    
    client.beginRequest();
    client.post("/valve");
    client.sendHeader(HTTP_HEADER_CONTENT_TYPE, "application/json");
    client.sendHeader(HTTP_HEADER_CONTENT_LENGTH, root.measureLength());
    client.sendBasicAuth(server_uname, server_pswd);
    client.endRequest();
    root.printTo(client);

    int resp_code = client.responseStatusCode();
    String resp_body = client.responseBody();
    if (resp_code == 200) {
      Serial.println("Valve update loop completed successfully");
    } else {
      Serial.print("Failed to notify success status to sever.\nResponse Code:");
      Serial.println(resp_code);
      Serial.print("Response:");
      Serial.println(resp_body);
      Serial.print("Reverting to original state");
      Serial.print(orig_state);
      change_valve_state(orig_state, orig_job_id);
    }

  }
}

void change_valve_state(int state, int job_id) {
  if (state == 1) {
    Serial.println("Switching ON the valve");
    digitalWrite(valve_pin, HIGH);
    valve_state = 1;
  } else {
    Serial.println("Switching OFF the valve");
    digitalWrite(valve_pin, LOW);
    valve_state = 0;
  }
  valve_job_id = job_id;
}

void setup() {

  // Valve
  pinMode(valve_pin, OUTPUT);
  change_valve_state(valve_state,  NULL);

  // Flow Sensor
  pinMode(flow_pin, INPUT);
  attachInterrupt(flow_pin, record_pulse, RISING);
  sei();
  last_read_time = millis();

  // Serial monitor for logging
  Serial.begin(115200);
  Serial.println();

  // Connect to WiFi
  Serial.printf("Connecting to %s ", wifi_ssid);
  WiFi.begin(wifi_ssid, wifi_pswd);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());

}

void loop() {
  flow_sensor_tasks();
  valve_tasks();
  Serial.println("Wait 20 seconds");
  delay(loop_interval);
}
