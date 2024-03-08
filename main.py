import sys
import eel
from DAT.basicsr import *

eel.init("web")


@eel.expose
def execute_enhance(selected_enhance_level):
    execute_DAT(selected_enhance_level)


eel.start("layout.html")

