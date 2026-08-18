import joblib
import numpy as np
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

def convert_model(joblib_path, onnx_path, num_features):
    print(f"Loading {joblib_path}...")
    model = joblib.load(joblib_path)
    
    initial_type = [('float_input', FloatTensorType([None, num_features]))]
    
    print(f"Converting to {onnx_path}...")
    onx = convert_sklearn(model, initial_types=initial_type)
    
    with open(onnx_path, "wb") as f:
        f.write(onx.SerializeToString())
    print("Done.")

if __name__ == "__main__":
    convert_model("hgb_regressor_image_only.joblib", "hgb_regressor_image_only.onnx", 84)
    convert_model("hgb_regressor_image_age_sex.joblib", "hgb_regressor_image_age_sex.onnx", 86)
    convert_model("anemia_classifier_image_only.joblib", "anemia_classifier_image_only.onnx", 84)
