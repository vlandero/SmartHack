import React from "react";
 
const KeysPopup = ({handleClose, content}) => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={handleClose}>x</span>
        {content}
      </div>
    </div>
  );
};
 
export default KeysPopup;