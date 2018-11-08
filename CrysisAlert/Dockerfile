# Image
FROM python:3.6

# python output to terminal without buffering
ENV PYTHONUNBUFFERED 1

# Root directory in ther container
RUN mkdir /cms

# Set the working directory
WORKDIR /cms

# Copy current directory contents into the container at /cms
ADD . /cms

# Install python packages
RUN pip install -r requirements.txt
