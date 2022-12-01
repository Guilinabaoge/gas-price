import logging
import time
import psycopg2

def getData():
    # Connect to your postgres DB
    conn = psycopg2.connect("dbname=postgres user=postgres ")

    # Open a cursor to perform database operations
    cur = conn.cursor()

    # Execute a query
    cur.execute("select states, avg(diesel) as diesel from final_gas where date between '2015-01-01' and '2015-05-01' group by states")

    # Retrieve query results
    records = cur.fetchall()

    return records

def getState(): 
    start_time = time.time()
    # Connect to your postgres DB
    conn = psycopg2.connect("dbname=postgres user=postgres ")

    # Open a cursor to perform database operations
    cur = conn.cursor()

    # Execute a query
    cur.execute("select states, avg(diesel) as diesel from final_gas where date between '2015-01-01' and '2015-05-01' group by states")

    # Retrieve query results
    result = cur.fetchall()
    query_time = time.time() - start_time
    logging.info("executed query in {0}".format(query_time))

    return result

def getBetween():
    start_time = time.time()
    # Connect to your postgres DB
    conn = psycopg2.connect("dbname=postgres user=postgres ")

    # Open a cursor to perform database operations
    cur = conn.cursor()
    # query = "select date,states,diesel from final_gas where date between '{0}' and '{1}' ".format(_from,_to)
    query = "select * from demo1 order by date"
    # Execute a query
    cur.execute(query)
    # Retrieve query results
    result = cur.fetchall()
    
    return result

def getHex():
    start_time = time.time()
    # Connect to your postgres DB
    conn = psycopg2.connect("dbname=postgres user=postgres ")

    # Open a cursor to perform database operations
    cur = conn.cursor()
    # query = "select date,states,diesel from final_gas where date between '{0}' and '{1}' ".format(_from,_to)
    query = "select diesel,lat,lng from demo3"
    print(query)
    # Execute a query
    cur.execute(query)
    # Retrieve query results
    result = cur.fetchall()
    
    return result


def getDiesel(year, month, day):
    
    # Connect to your postgres DB
    conn = psycopg2.connect("dbname=postgres user=postgres ")

    # Open a cursor to perform database operations
    cur = conn.cursor()
    # query = "select date,states,diesel from final_gas where date between '{0}' and '{1}' ".format(_from,_to)
    query = "select avg as diesel,lat,lng from (select distinct stid, avg ,lat,lng from perfect where date = '{0}-{1}-{2}') as p".format(year,month,day)
    print(query)
    # Execute a query
    cur.execute(query)
    # Retrieve query results
    result = cur.fetchall()
    
    return result
