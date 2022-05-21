wget https://github.com/prometheus/prometheus/releases/download/v2.34.0-rc.1/prometheus-2.34.0-rc.1.linux-amd64.tar.gz

tar -xvf prometheus-2.34.0-rc.1.linux-amd64.tar.gz 

cd prometheus-2.34.0-rc.1.linux-amd64/

# ./prometheus 

sudo cp -r . /usr/local/bin/prometheus
#---------

echo "INSTALL PROMETHOUES"

sudo cat<<EOF | sudo tee /etc/systemd/system/prometheus.service

[Unit]
Description=Promethus Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/prometheus/prometheus --config.file=/usr/local/bin/prometheus/prometheus.yml

[Install]
WantedBy=multi-user.target

EOF

#----------------


sudo systemctl daemon-reload
sudo service prometheus restart
#sudo service prometheus status
#PROMETHOES PORT 9090


wget https://github.com/prometheus/node_exporter/releases/download/v1.3.1/node_exporter-1.3.1.linux-amd64.tar.gz

tar xzf node_exporter-1.3.1.linux-amd64.tar.gz 

sudo cp node_exporter-1.3.1.linux-amd64/node_exporter  /usr/local/bin/

ls /usr/local/bin/


sudo cat<<EOF | sudo tee /etc/systemd/system/node-exporter.service

[Unit]
Description= NodeExporter Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target

EOF


sudo systemctl daemon-reload  

sudo service node-exporter start

#sudo service node-exporter status


#------------------

sudo service prometheus stop

sudo cat<<EOF | sudo tee /usr/local/bin/prometheus/prometheus.yml 
# my global config
global:
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.

scrape_configs:
  - job_name: prometheus
    honor_labels: true
    honor_timestamps: true
    scheme: http
    scrape_interval: 60s
    scrape_timeout: 55s
    metrics_path: /metrics
    static_configs:
    - targets: ['localhost:9090']
  - job_name: node-exporter
    honor_labels: true
    honor_timestamps: true
    scheme: http
    scrape_interval: 60s
    scrape_timeout: 55s
    metrics_path: /metrics
    static_configs:
    - targets: ['localhost:9100']
   
EOF



sudo service prometheus start
#sudo service prometheus status




# sudo apt-get install -y apt-transport-https
# sudo apt-get install -y software-properties-common wget

sudo yum install -y apt-transport-https
sudo apt-get install -y software-properties-common wget
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -


echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list

echo "deb https://packages.grafana.com/oss/deb beta main" | sudo tee -a /etc/apt/sources.list.d/grafana.list

sudo apt-get update
sudo apt-get install grafana -y 

sudo systemctl daemon-reload
sudo systemctl start grafana-server
#sudo systemctl status grafana-server

sudo systemctl enable grafana-server.service

# GRAPHANA PORT --> 3000
# ADD DATASOURECE --> PROMETHOUES --> http://localhost:9090/

#1860 ID

