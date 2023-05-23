import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";

const Multiselect = ({ prevSelection, onSelectUpdate, peripherals }) => {
  const [selected, setSelected] = useState(prevSelection.map((p) => ({ label: `${p.uid}`, value: p._id })) || []);

  const updateSelection = async (newSelection) => {
    console.log("🚀 ~ file: Multiselect.js:70 ~ updateSelection ~ newSelection", newSelection)
    setSelected(newSelection);
    onSelectUpdate(newSelection)
  }


  return (
    <div>
      <MultiSelect
        options={peripherals.map((p) => ({ label: `${p.uid}`, value: p._id }))}
        value={selected}
        onChange={updateSelection}
        labelledBy="Peripherals"
      />
    </div>
  );
};

export default Multiselect;