from flask import Flask
from collections import Counter
from query import getState,getBetween,getHex,getDiesel
from flask_cors import CORS


app = Flask(__name__)
CORS(app)



@app.route("/")
def hello_world():
    return "<p>Dataviz backend</p>"


@app.route('/countme/<input_str>')
def count_me(input_str):
    input_counter = Counter(input_str)
    response = []
    for letter, count in input_counter.most_common():
        response.append('"{}": {}'.format(letter, count))
    return '<br>'.join(response)


@app.route("/states")
def sortby():
    result = getState() 
    header = 'state,diesel\n'
    str_rows = [','.join(map(str, row)) for row in result]
    return header + '\n'.join(str_rows)


@app.route("/hchart")
def between():
    result = getBetween()
    header = 'date,name,value\n'
    str_rows = [','.join(map(str, row)) for row in result]
    return header + '\n'.join(str_rows)

@app.route("/hex")
def hex():
    result = getHex()
    header = 'diesel,lat,lng\n'
    str_rows = [','.join(map(str, row)) for row in result]
    return header + '\n'.join(str_rows)


@app.route("/diesel/<year>/<month>/<day>")
def diesel_price(year,month,day):
    result = getDiesel(year,month,day)
    header = 'diesel,lat,lng\n'
    str_rows = [','.join(map(str, row)) for row in result]
    return header + '\n'.join(str_rows)
  
