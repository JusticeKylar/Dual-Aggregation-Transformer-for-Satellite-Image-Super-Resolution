import os
import eel

eel.init("web")


@eel.expose
def execute_enhance(selected_enhance_level):
    os.system("python DAT/basicsr/test.py -opt options/Test/test_single_x2.yml")


eel.start("layout.html")

