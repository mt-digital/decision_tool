#!/usr/local/bin/python
"""
Web app for displaying survey results
"""
import json
import pandas as pd

from flask import Flask, render_template
from flask_wtf import Form
from wtforms import SelectMultipleField, SubmitField

app = Flask(__name__)

app.secret_key = 'hard to guess string'

DF = pd.read_csv('static/responses_no_response_rate.csv',
                 names=['region', 'question', 'response', 'frequency'],
                 header=None)

REGIONS = DF.region.unique()

@app.route('/', methods=['GET', 'POST'])
def index():
    """
    Mostly single-page web app, here the index is used to view the results
    given form inputs. The default view is just "ALL", the whole region
    together.
    """
    # default, will append more if user selects more
    regions = ["ALL"]

    form = CountyForm()

    if not form.regions.data:
        regions = ['ALL']
    else:
        regions = form.regions.data

    # don't allow more than three selections
    if len(regions) > 3:
        regions = regions[:3]

    # data dict will be in the proper form for JSON data to be passed to templ
    json_data = make_data_json(regions)

    javascript = render_template('barchart.js', json_data=json_data,
                                 n_regions=len(regions))
    all_region_summaries = \
        json.loads(open('static/region_summaries.json', 'r').read()[3:])

    region_summaries = [(r, all_region_summaries[r])
                        for r in regions if r in all_region_summaries]

    print region_summaries

    return render_template('index.html', javascript=javascript, form=form,
                           region_summaries=region_summaries)

#: Questions in the order requested by L
ORDERED_QUESTIONS = ['9', '8a', '18c', '18d', '18a']


QUESTION_LOOKUP = \
    {'9': 'Indicate which of the following categories best fits your tillage practice',
     '8a': 'I consider myself to be an aggressive adopter of conservation practices',
     '18c': 'Human activities are the primary cause of climate change',
     '18d': 'I will have to make serious changes to my farming operation to adjust to climate change',
     '18a': 'I have observed changes in weather patterns over my lifeteime'}


def make_data_json(regions):
    """
    Given the counties the user is interested in, select the rows from the
    dataframe and return a JSON representation for use in the javascript
    """
    regions_df = DF[DF.region.isin(regions)]

    data_dict_list = []

    # each dataset has a list of objects with question at the top level
    for q in ORDERED_QUESTIONS:

        q_data_dict = {}
        q_data_dict.update(question=QUESTION_LOOKUP[q])
        q_df = regions_df[regions_df.question == q]

        # each question has region_responses: region name, and array of JSON
        # tuples of response and percent responding that response
        region_responses = []
        for region in regions:

            region_dict = dict(region=region)

            reg_qst_df = q_df[q_df.region == region]
            pct_response = reg_qst_df.frequency
            pct_response = pct_response/pct_response.sum()

            resp_pct = zip(reg_qst_df.response, pct_response)

            region_dict.update(responses=\
                [{'response': rp[0], 'frequency': rp[1]} for rp in resp_pct])

            region_responses.append(region_dict)

        q_data_dict.update(region_responses=region_responses)

        data_dict_list.append(q_data_dict)

    return json.dumps(data_dict_list)


def extract_():
    """
    docstring for extract_

    """
    pass


class CountyForm(Form):
    """Dropdown, multi select form to pick counties to copmare"""

    regions = SelectMultipleField(u'Regions', choices=zip(REGIONS, REGIONS))

    submit = SubmitField('Compare Regions')


if __name__ == '__main__':
    app.run(debug=True)
