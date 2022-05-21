import pymongo
username = ""
password = ""
database_name = ""
Client = pymongo.MongoClient(f"mongodb+srv://{username}:{password}@cluster0.yku7r.mongodb.net/?retryWrites=true&w=majority")
database = Client[database_name]