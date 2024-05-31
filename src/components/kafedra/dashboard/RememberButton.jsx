import React, {useState} from 'react';
import {AnimateSharedLayout, motion} from "framer-motion";
import KafedraExpandedCard from "./KafedraExpandedCard";
import {FaTriangleExclamation} from "react-icons/fa6";

const loaderVariants = {
  animationOne: {
    scale: 1.1,
    transition: {
      yoyo: Infinity,
      duration: 0.25
    }
  },
  hover: {
    scale: 1,
    textShadow: "0 0 8px rgb(255,255,255)",
    boxShadow: "0 0 8px #f00",
  },
  focus: {
    scale: 0.9
  }
}

const RememberButton = ({data,count}) => {
  const [expanded,setExpanded] = useState(false);
  const sty1={
    left:"10px"
  }
  return (
    <AnimateSharedLayout >
        {expanded &&
            <KafedraExpandedCard
                sty={sty1}
                setExpanded={() => setExpanded(false)}
                isDefault={false}
                openColor={"#f00"}
                title={"Teachers who are late for class"}
                openTable={data?.length!==0}
                data={data}
            />
        }
            <motion.div
                layoutId="kafedraId"
                style={{
                  width:'100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
            >
                <motion.button
                    style={{
                      width: "80px",
                      minHeight:"80px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color:"#fff",
                      backgroundColor: "#f00",
                      border:"none",
                      fontSize:"24px",
                      borderRadius: "50%"
                    }}
                    variants={loaderVariants}
                    animate="animationOne"
                    whileHover="hover"
                    onClick={()=>setExpanded(true)}
                >
                  <FaTriangleExclamation />{'\xa0'}{data?.length}
                </motion.button>
            </motion.div>


    </AnimateSharedLayout>
  );
};

export default RememberButton;