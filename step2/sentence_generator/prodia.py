import logging

import requests

from config_master import PRODIA_API_KEY
from step2.sentence_generator.config import BASE_URL, GENERATE_SD_IMAGE_URL, GET_GENERATED_JOB_URL


class ImageGenerator:

    def __init__(self):
        self.headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "X-Prodia-Key": PRODIA_API_KEY
        }
        self.base_url = BASE_URL

    def generate_image(self, prompt: str):
        """
        This method generates an image using porodia ai
        """
        url = f"{self.base_url}{str(GENERATE_SD_IMAGE_URL)}"
        payload = {
            "prompt": prompt,
            "steps": 30,
        }
        response = requests.post(url, json=payload, headers=self.headers)
        return response.json()

    def get_generated_image(self, job_id: str):
        """
        This method gets generated image
        """
        get_job_url = GET_GENERATED_JOB_URL % job_id
        url = f"{self.base_url}{get_job_url}"
        response = requests.get(url, headers=self.headers)
        return response.json()

    def process(self, prompt):
        """
        This method keeps checking if image generation is done and returns it if its done
        """
        image_details = {}
        try:
            job_detail = self.generate_image(prompt)
        except Exception as e:
            logging.error(e)
            print(str(e))
            return image_details
        if job_detail.get('status') == 'queued':
            maximum_number_tries = 20
            counter = 0
            image_generation_competed = False
            job_id = job_detail.get('job_id')

            while not image_generation_competed:
                counter += 1
                try:
                    image_details = self.get_generated_image(job_id=job_id)
                    if image_details.get('status') == 'succeeded':
                        image_generation_competed = True
                    if counter > maximum_number_tries:
                        image_generation_competed = True
                except Exception as e:
                    logging.error(e)
                    print(str(e))
        return image_details
