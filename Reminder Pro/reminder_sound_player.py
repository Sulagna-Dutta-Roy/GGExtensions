import playsound

def play_notification_sound(message):
  # Display basic notification (optional)
  # ... (use system libraries to display notification)

  # Play the sound using playsound or equivalent library
  sound_file_path = message.get('soundFilePath')
  if sound_file_path:
    playsound(sound_file_path)
  else:
    print("No sound file provided in message")