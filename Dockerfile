FROM node
WORKDIR /app
EXPOSE 9028

COPY . .
RUN npm install

ENV MQTT_DEFAULT_CONFIG=/etc/gateway/mqtt-config.json \
    UI_SRC_PATH=/app/UI

# copy scripts and bootstrapper
COPY ./bootstrapper ./bootstrapper/
COPY ./scripts ./scripts/
COPY ./UI ./UI/

# On first start deploy the config-ui and on shutdown remove config-ui this is also done inside the entrypoint script
RUN chmod +x scripts/entrypoint.sh
RUN chmod +x bootstrapper/*.sh
ENTRYPOINT ["scripts/entrypoint.sh"]