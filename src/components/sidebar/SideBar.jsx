import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../utills/ServiceUrls";
import {useEffect, useRef, useState} from "react";
import SideBarDropdown from "./SideBarDropdown";
import {useDispatch, useSelector} from "react-redux";
import {btntoggle} from "../../redux/slice/btnvalue";
import axios from "axios";
import {fetchEducationYear} from "../../redux/actions/educationYear/education_year_actions";



const SideBar = ({SidebarData}) => {
    const dispatch = useDispatch()
    const btntoggleval2 = useSelector(state => state.btnvalue.btnAction)
    const {headers} = getHeaders()
    const ref = useRef(null)

    /* width ekran*/
    function getWindowDimensions() {
        const {innerWidth: width} = window;
        return {
            width
        };
    }


    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    /*****/
    useEffect(() => {
        if (windowDimensions.width < 576) {
            const handleClickOutside = (event) => {
                if (!ref?.current?.contains(event.target)) {
                    dispatch(btntoggle(true))
                }
            };

            document.addEventListener("mousedown", handleClickOutside);

            return () => document.removeEventListener("mousedown", handleClickOutside);

        }

    }, [ref]);

    return (
        <Container ref={ref} btnval={btntoggleval2}>
                <MenuItemsWrapper>
                    {
                        SidebarData.map((item, index) => <SideBarDropdown key={index} item={item}/>)
                    }
                </MenuItemsWrapper>
        </Container>
    );
};

const Container = styled.div`
    position: fixed;
    top: 60px;
    width: ${props => props.btnval==='open' ? "5vw " : "20vw"};
    transition: .3s;
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: ${mainColor};
    overflow-y: auto;
    z-index: 2;
    
    @media only screen and  (min-width: 576px) and  (max-width: 768px) {
        width: ${props => props.btnval==='open' ? "0vw " : "55vw"};
    }
    @media only screen and  (max-width: 576px) {
        width: ${props => props.btnval==='open' ? "0vw " : "65vw"};
    }
`;

const MenuItemsWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 10px !important;
    background-color: ${mainColor};
    border-radius: 8px;

`;


export default SideBar;