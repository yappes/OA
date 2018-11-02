import axios from "axios"

export default {
  findSourceColumnsByModuleId({
    moduleId,
  }){
    return axios.post("platform://custom/C01010",{
      moduleId,
    }).then(res => res.data);
  }
}