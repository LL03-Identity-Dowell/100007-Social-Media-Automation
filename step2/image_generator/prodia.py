import logging
import random
from time import sleep
import re
import requests
from transformers import pipeline, set_seed

from config_master import PRODIA_API_KEY
from step2.image_generator.config import BASE_URL, GENERATE_SD_IMAGE_URL, GET_GENERATED_JOB_URL

gpt2_pipe = pipeline('text-generation', model='Gustavosta/MagicPrompt-Stable-Diffusion', tokenizer='gpt2')


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

    def generate_stable_diffusion_prompt(self, starting_text):
        """
        This method generates a better prompt for image generation
        """
        seed = random.randint(100, 1000000)
        set_seed(seed)

        response = gpt2_pipe(starting_text, max_length=(len(starting_text) + random.randint(60, 90)),
                             num_return_sequences=4)
        response_list = []
        for x in response:
            resp = x['generated_text'].strip()
            if resp != starting_text and len(resp) > (len(starting_text) + 4) and resp.endswith(
                    (":", "-", "—")) is False:
                response_list.append(resp + '\n')

        response_end = "\n".join(response_list)
        response_end = re.sub('[^ ]+\.[^ ]+', '', response_end)
        response_end = response_end.replace("<", "").replace(">", "")

        if response_end != "":
            return response_end

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
            prompt=self.generate_stable_diffusion_prompt(starting_text=f'image about this title "{str(prompt)}"')
        except Exception as e:
            logging.exception(e)
            print(str(e))
        try:
            job_detail = self.generate_image(prompt)
        except Exception as e:
            logging.error(e)
            print(str(e))
            return image_details
        if job_detail.get('status') == 'queued':
            maximum_number_tries = 20
            counter = 0
            sleep_time = 0.5
            image_generation_competed = False
            job_id = job_detail.get('job')

            while not image_generation_competed:
                counter += 1
                sleep(sleep_time)
                print('Checking image is done processing....')
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
# pip3 install torch==2.1.2+cpu torchvision==0.16.2+cpu -f https://download.pytorch.org/whl/torch_stable.html