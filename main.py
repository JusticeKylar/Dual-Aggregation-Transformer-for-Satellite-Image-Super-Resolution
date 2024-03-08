import eel

eel.init("web")


@eel.expose
def bruh():
    print("haiii")


eel.start("layout.html")