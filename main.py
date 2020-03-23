import flask_cors
from flask import Flask
import googleapiclient.discovery


SPREADSHEET_ID = '1daVpwMJze53A2XtMK6ZYsOkW4IKe2M3RTySNx18l6sk'
RANGE_DATES = 'Sheet1!A:A'
RANGE_PULL_UPS = 'Sheet1!B:B'
RANGE_VITAMINS = 'Sheet1!N:N'
RANGE_METAMUCIL = 'Sheet1!O:O'


app = Flask(__name__)
flask_cors.CORS(app)

service = googleapiclient.discovery.build('sheets', 'v4')
sheet = service.spreadsheets()


def id_(cell):
    if not len(cell):
        return None

    return cell[0]


def parse_bool(cell):
    if not len(cell):
        return False

    if cell[0] == 'n':
        return False

    return True


def parse_int(cell):
    value = id_(cell)

    if value is None:
        return 0

    return int(value)


def get_column(range_dates, range_data, parse=id_):
    result = sheet.values().batchGet(spreadsheetId=SPREADSHEET_ID, ranges=[range_dates, range_data]).execute()

    value_ranges = result.get('valueRanges')

    if value_ranges is None or len(value_ranges) != 2:
        return {'error': 'error fetching'}

    dates = [c[0] for c in value_ranges[0]['values'][1:]]
    data = [parse(c) for c in value_ranges[1]['values'][1:]]

    return dict(zip(dates, data))


@app.route('/pull-ups')
def pull_ups():
    return get_column(RANGE_DATES, RANGE_PULL_UPS, parse=parse_int)


@app.route('/vitamins')
def vitamins():
    return get_column(RANGE_DATES, RANGE_VITAMINS, parse=parse_bool)


@app.route('/metamucil')
def metamucil():
    return get_column(RANGE_DATES, RANGE_METAMUCIL, parse=parse_bool)
