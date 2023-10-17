from rest_framework import serializers
from .models import Room

#here we take a room object and serialize it into something that we can return back as a response 
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at')
        
        
#use the CreayeRoomSeializer to send a post request. we serialize a request, that is it's going to take data from a request and make sure its all valid andgive it to us in a python format that we can work with  
class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip')


class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])

    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'code')