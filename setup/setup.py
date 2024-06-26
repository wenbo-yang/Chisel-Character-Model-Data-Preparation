import os

os.system('openssl genrsa -out key.pem')
os.system('openssl req -new -key key.pem -out csr.pem')
os.system('openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem')

