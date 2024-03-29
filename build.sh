sudo docker rm $(sudo docker ps -aq) -f
sudo docker rmi $(sudo docker images -q) -f
sudo docker build -t quest . --no-cache
sudo docker run -p 80:8080 quest -v "/home/dhdenvo/Pictures/QuestBoardImages:/savedImages"
