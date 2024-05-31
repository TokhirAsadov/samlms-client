import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import 'react-phone-input-2/lib/style.css'
import {Link} from "react-router-dom";
import {BASE_URL, getHeaders, mainColor} from "../../utills/ServiceUrls";
import axios from "axios";
import {useHttp} from "../hook/useHttp";
import {useDispatch, useSelector} from "react-redux";
import {fetchUser} from "../../redux/actions/user/user_actions";
import {motion as m} from 'framer-motion'
import countryList from "react-select-country-list";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Select from '@mui/material/Select';
import TextField from "@mui/material/TextField";
import {FaSave} from "react-icons/fa";


const prepareForm = (formArr) => {
    return formArr.reduce((r,v) => v.name!=="lessonDtos" ? ({...r,[v.name]: ""}) : ({...r,[v.name]: []}),{});
}


const SaveSelectAddress = ({ constant,formArr, redirect,onClose }) => {

  const [form,setForm] = useState(prepareForm(formArr));

  const [isValid, setIsValid] = useState(false)
  const user = useSelector(state => state?.user?.user);

  const { request } = useHttp();
  const dispatch = useDispatch();

  const onChangeHandler = (e,name) => setForm(p => ({...p,[name]: e.target.value}));

  const fixedForm = async () => {
    if (constant){
      if (user?.address?.id!==null){
        setForm(p => ({...p,id: user?.address?.id}))
      }
      setForm(p => ({...p,constant: constant,asCurrent:false}))
    }
    else {
      if (user?.addressCurrent?.id!==null){
        setForm(p => ({...p,id: user?.addressCurrent?.id}))
      }
      setForm(p => ({...p,constant: constant,asCurrent:true}))
    }
  }



  const close = () => onClose();
  const onSubmitHandler = async () => {
    isValid && axios.post(BASE_URL+"/address/createForUser",form,{headers})
      .then(res => {
        close();
        dispatch(fetchUser(request))
      })
      .catch(err => {
        console.log(err);
      })
  }

  const { headers } = getHeaders();

  const hasRedirect = !!redirect;


  useEffect(() =>{
    if (form?.country && form?.region && form?.area && form?.address && form?.constant!==null && form?.asCurrent!==null){
      setIsValid(true);
    }
  },[form])


  const [isUzbek,setIsUzbek] = useState(true);
  const [countries,setCountries] = useState([])
  const [country,setCountry] = useState(null)
  const [countryCode,setCountryCode] = useState("")
  const [regions,setRegions] = useState([])
  const [districts,setDistricts] = useState([])
  const [villages,setVillages] = useState([])

  useEffect(()=>{
    fixedForm();
    setCountries(countryList().getData())

    axios.get(BASE_URL+"/address/regions")
      .then(res => {
        console.log(res.data,"regions")
        setRegions(res?.data?.obj);
      })
      .catch(err => {
        console.log(err,"err")
      })

  },[])

  useEffect(()=>{
    console.log(country,"change country")
  },[country])

  const variants = {
    visible: index => ({
      opacity: 1,
      transition: {
        delay: index * 0.1,
      },
    }),
    hidden: { opacity: 0 },
  }



  const variants3 = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  };

  const [addressUser,setAddressUser] = useState({
    country: "",
    region:"",
    district:"",
    village: "",
    address:""
  })

  const resetAddress = {
    country: "",
    region:"",
    district:"",
    village: "",
    address:""
  }

  const [regionId,setRegionId] = useState(0)
  const [districtId,setDistrictId] = useState(0)
  const [villageId,setVillageId] = useState(0)

  const handleChangeValue = (e) => {
    setAddressUser(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  useEffect(()=>{
    console.log(addressUser,"address user changed")
  },[addressUser])

  useEffect(()=>{
    console.log(regionId,"regionId change");
    regionId!==0 && regionId &&
      axios.get(BASE_URL+"/address/districtsByRegionId/"+regionId)
        .then(res => {
          console.log(res,"res districts")
          setDistricts(res?.data?.obj);
        })
  },[regionId])

  useEffect(()=>{
    console.log(districtId,"district change");

    districtId!==0 && districtId &&
    axios.get(BASE_URL+"/address/villagesByDistrictId/"+districtId)
      .then(res => {
        console.log(res,"res villeges")
        setVillages(res?.data?.obj);
      })

  },[districtId])


  return (
      <SForm >
          <Title>{constant ? "Constant address" : "Current address"}</Title>
          <Wrapper>
            <span className={`flag-icon flag-icon-${countryCode?.toLowerCase()}`}/>&nbsp;
            <Box sx={{minWidth: 200}}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Country</InputLabel>
                <Select
                  sx={{width:"200px"}}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Country"
                  name={'country'}
                  onChange={
                    e=> {
                      console.log(e,"<- davlat")
                      console.log(countries?.find(i => i.value===e.target.value))
                      setAddressUser(preForm => ({...preForm,...resetAddress,country: countries?.find(i => i?.value===e?.target?.value)?.label}))

                      setCountryCode(e?.target?.value)

                      if (e?.target?.value === "UZ") {
                        setIsUzbek(true)
                      }
                      else {
                        setIsUzbek(false)
                      }

                      setCountry(e)
                    }
                  }
                >
                  {
                    countries?.map(i => {
                      return <MenuItem value={i?.value} key={i?.value}>{i?.label}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
            </Box>


          </Wrapper>

        {
          isUzbek && regions?.length > 0 ? <div style={{ display: 'flex',flexDirection:'column',gap: '20px' }}>
              <Box sx={{minWidth: 200}}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Region</InputLabel>
                  <Select
                    sx={{width:"200px"}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={regions?.map(i => i?.nameUz)}
                    label="Region"
                    name={'region'}
                    onChange={e => {
                      setRegionId(regions?.find(i => i?.nameUz === e?.target?.value)?.id);

                      handleChangeValue(e)
                    }}
                  >
                    {
                      regions?.map(i => {
                        return <MenuItem value={i?.nameUz} key={i?.id}>{i?.nameUz}</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{minWidth: 200}}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">District</InputLabel>
                  <Select
                    sx={{width:"200px"}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="District"
                    name={'district'}
                    onChange={e => {
                      setDistrictId(districts?.find(i => i?.nameUz === e?.target?.value)?.id);
                      handleChangeValue(e)
                    }}
                  >
                    {
                      districts?.map(i => {
                        return <MenuItem value={i?.nameUz} key={i?.id}>{i?.nameUz}</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{minWidth: 200}}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Village</InputLabel>
                  <Select
                    sx={{width:"200px"}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Village"
                    name={'village'}
                    onChange={e => {
                      setVillageId(villages?.find(i => i?.nameUz === e?.target?.value)?.id);
                      handleChangeValue(e)
                    }}
                  >
                    {
                      villages?.map(i => {
                        return <MenuItem value={i?.nameUz} key={i?.id}>{i?.nameUz}</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
              </Box>

              <TextField sx={{width:"200px"}} id="outlined-basic" label="Address" variant="outlined"
                         value={addressUser?.address}
                         name={"address"}
                         onChange={handleChangeValue}
              />

            <Button>Save</Button>

            </div>
            :
            <m.div
              initial={false}
              animate={!isUzbek ? "open" : "closed"}
            >
              <InputWrapper
                variants={variants}
              >
                {formArr?.map(({label, name, placeholder, type}, index) => {
                  return <Wrapper2
                    key={index}
                    variants={variants3}
                  >
                    <Label htmlFor={name} display={name === "id" || name ==="country"}>{label}</Label>
                    <Input
                      key={index}
                      display={name === "id" || name ==="country"}
                      id={name}
                      name={name}
                      type={type}
                      value={form[name]}
                      onChange={(e) => onChangeHandler(e, name)}
                      placeholder={placeholder}
                      required={true}
                    />
                  </Wrapper2>
                })}
              </InputWrapper>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onSubmitHandler();
                }}
              ><FaSave/>
                Save
              </Button>
              {hasRedirect && (
                <Redirect>
                  <RedirectLabel>{redirect.label}&nbsp;</RedirectLabel>
                  <RedirectLink to={redirect.link.to}>{redirect.link.label}</RedirectLink>
                </Redirect>
              )}
            </m.div>
        }

      </SForm>
  );
};

const SForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #fff;
  height: 45vh;
  width: 500px;
  border-radius: 10px;
  color: ${mainColor};
`;

const InputWrapper = styled(m.div)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 90%;
   
`;

const Wrapper = styled(m.div)`
  display: flex;
  justify-content: space-between;
  & > div{
    width: 250px!important;
  }
`;

const Wrapper2 = styled(m.div)`
  width: 400px;
  display: flex;
  justify-content: space-between;
  & > div{
    width: 250px!important;
  }
`;

const Input = styled.input`
  border: 1px solid ${mainColor};
  width: 200px;
  padding-left: 10px!important;
  border-radius: 5px;
  display: ${props => props.display ? "none" : "block"};
  cursor: pointer;
  
  &::placeholder{
    font-size: 14px;
    letter-spacing: 1.1px;
    color: ${mainColor};
  }
  &:focus{
    outline: none;
  }
`;


const Button = styled.button`
  width: 200px;
  height: 30px;
  margin-top: 20px!important;
  background-color: ${mainColor};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
  letter-spacing: 0.7px;
  font-weight: 400;
  cursor: pointer;
  transition: all ease 0.4s;
  border: none;
  border-radius: 5px;
  
  &:focus{
    transform: scale(0.9);
  }
`;

const Label = styled.label`
  font-size: 20px;
  display: ${props => props.display ? "none" : "block"};
`;

const Redirect = styled.div`
  font-size: 12px;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px!important;
`;

const RedirectLabel = styled.span`

`;
const Title = styled.h3`
  color: ${mainColor};
  margin-bottom: 20px!important;
`;

const RedirectLink = styled(Link)`
  text-decoration: none;
  color: blue;
`;

export default SaveSelectAddress;