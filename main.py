import eel

eel.init('web_files')


@eel.expose
def fart():
    print("it works! yayy!! :3")
    exit()
    quit()


eel.start('layout.html')