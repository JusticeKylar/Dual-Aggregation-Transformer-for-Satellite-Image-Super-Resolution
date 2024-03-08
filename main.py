import eel
from DAT.basicsr import *

eel.init("web")


@eel.expose
def execute_enhance(args):
    execute_DAT()


eel.start("layout.html")