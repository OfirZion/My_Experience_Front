import axios from "axios";
import { withHandleError } from "../utils";
import { IResponse } from "../types/http.types";

const fileService = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await axios.post<IResponse<string>>("/upload",formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    }) 
    return response.data
}

export default withHandleError(fileService)