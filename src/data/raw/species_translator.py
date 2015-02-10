#!/usr/bin/python

import sys
import csv
import json
import copy

if len(sys.argv) == 1 :
    print ('You need to provide a file to parse from')
    sys.exit()
if len(sys.argv) == 2 :
    print ('You need to provide a file to write to')
    sys.exit()

csv_file = open(sys.argv[1], 'rt')
reader = csv.reader(csv_file)
json_file = open(sys.argv[2], 'wt')

data = []
row_data = {}

rownum = 0
for row in reader:
    if rownum == 0:
        header = row
    else:
        colnum = 0
        for col in row:
            row_data[header[colnum]] = col
            colnum += 1
        data.append(copy.copy(row_data))
        
    rownum += 1

json_file.write(json.dumps(data, indent=2))

csv_file.close()
json_file.close()
