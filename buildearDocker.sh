echo '=== Starting building SNOMED image'
docker build . -t "nomenclador-snomed:v1.0"
echo '=== Done!'
echo '=== Start running SNOMED image'
docker run -d -p 9090:9090 nomenclador-snomed:v1.0
echo '=== Done'