from django.shortcuts import render
from backend.revolap.models import RevOlapBaseDim

# Create your views here.

class CubeService:
    def __init__(self): 
        pass 

    def drill_down_cube_data(self, *args, **kwargs):
        pass

    def roll_up_cube_data(self, *args, **kwargs):
        pass

    def slice_cube_data(self, *args, **kwargs):
        pass

    def fetch_cube_data_by_criteria(self, criteria: dict, *args, **kwargs):
        pass

    def drill_down_dimension(self, dimension: RevOlapBaseDim,  *args, **kwargs):
        pass



    def create_cube(self, name: str, code_name: str, app_name: str, dimensions: dict, is_active: bool = True):
        """
        *. create the table row in revolap_cube with name etc
            revolap_cube
                id
                name
                code_name
                app_name
                is_active

                
                @property 
                get_data_table: f"revolap_cube_{code_name}_data"

        *. create the database table revolap_cube_{code_name}_data
            id
            cube_id
            {dimensions_ids}

            val_num (numeric value, typically float/double)
        *. create the proper model class for it
        """
        pass



