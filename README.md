# Lucky_Monster

## Run the Call Center backend
Our project is deployed on the school server. Please connect to NTU network and view <http://172.21.148.165:8000/docs/> for backend api documentation.

Check this link for all the crisis reports in the database. <http://172.21.148.165:8000/api/crisis_view>
Also the filters can be applyed. For example http://172.21.148.165:8000/api/crisis_view/?status=S [S|I|U] or something like crisis_type=["Fire"]


To run the system on localhost. First you need to install [docker](https://www.docker.com/get-started). 
```bash
cd CrysisAlert
docker-compose up
```

To load the test data
```bash
docker-compose run web load dbexport.json
```
