#!/usr/bin/python

# Transforms a CSV file into a JSON file
# eg.
# A, B, C[], C[], C[], D[], E{A}, E{B}
#
# {A, B, [C, C, C], [D], E:{A, B}}

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
        #initial header saving
        header = row
    else:
        colnum = 0
        row_data = {}
        for col in row:
            key = header[colnum]
            array = key.find('[]')
            object = key.find('{')

            #translate digits
            if col.replace('.','',1).isdigit():
                try:
                    col = int(col)
                except ValueError:
                    col = float(col)

            #check if the col name is array
            if array != -1:
                key = key[:array] #crop the []
                try:
                    row_data[key]
                except KeyError:
                    row_data[key] = []
                if col:
                    row_data[key].append(col)

            #check if the col name is object
            elif object != -1:
                object_key = key[:object] #crop the {xx}
                inner_object_key = key[object + 1 : -1] #extract XX from {xx}
                try:
                    row_data[object_key]
                except KeyError:
                    row_data[object_key] = {}
                row_data[object_key][inner_object_key] = col

            else:
                row_data[key] = col
            colnum += 1
        data.append(copy.copy(row_data))
        
    rownum += 1

json_file.write(json.dumps(data,separators=(',', ':')))

csv_file.close()
json_file.close()

