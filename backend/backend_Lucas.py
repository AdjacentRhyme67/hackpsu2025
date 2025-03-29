from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Niko Roberts'


@app.route('/hello/')
@app.route('/hello/<name>')
def hello(name='Niko'):
    return render_template('hello.html', name=name)


@app.route('/submit', methods=['POST'])
def submit():
    name = request.form['name']
    return f'You submitted: {name}'

if __name__ == '__main__':
    app.run(debug=True)