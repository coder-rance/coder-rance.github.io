FROM frolvlad/alpine-python3:latest

RUN mkdir /app
WORKDIR /app

RUN pip3 install flask
ADD . /app/

EXPOSE 5000
CMD python3 app.py