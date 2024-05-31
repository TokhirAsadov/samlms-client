import React, {useEffect, useState} from 'react';
import {RiMenu2Fill, RiMenuFoldLine, RiMenuUnfoldLine} from "react-icons/ri";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {btntoggle} from "../../redux/slice/btnvalue";

const SidebarBtn = () => {
    const btntoggleval = useSelector(state => state.btnvalue.btnval)
    const dispatch = useDispatch()

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
    const handleShow = () => {
        dispatch(btntoggle(!btntoggleval))
    }

    return (
        <>
            {windowDimensions.width < 576 ? (
                btntoggleval ? (
                    <Btnsidebar onClick={handleShow}>
                        <RiMenuUnfoldLine size={20}/>
                    </Btnsidebar>
                ) : (
                    <Btnsidebar onClick={handleShow}>
                        <RiMenuFoldLine size={20}/>
                    </Btnsidebar>
                )
            ) : (
                <Btnsidebar onClick={handleShow}>
                    <RiMenu2Fill size={20}/>
                </Btnsidebar>
            )}

        </>
    );
}

const Btnsidebar = styled.div`
    color: rgb(84, 84, 84);
    margin-left: 5px;
    cursor: pointer;

    &:hover {
        color: blue;
    }
`

export default SidebarBtn;