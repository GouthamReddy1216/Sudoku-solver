import React from 'react'
const cell=({value})=>{
    return(
        <div className='cell'>
        <input
        type='text'
        className="cell"
        value={value}
        maxLength="1"
        />
        </div>
    );
}
export default cell;