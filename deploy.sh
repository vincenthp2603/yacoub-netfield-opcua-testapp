cd UI
for file in *; do
    sudo cp $file /usr/local/share/cockpit/AirConditionerObserver/$file;
done

sudo systemctl stop cockpit
sudo systemctl stop cockpit.socket
sudo systemctl start cockpit