import eel

eel.init('web_files')
eel.start('layout.html')


@eel.expose
def test():
    print("it works! yayy!! :3")
    exit()
    quit()
