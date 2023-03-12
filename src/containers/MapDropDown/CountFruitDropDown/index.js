import React, {
  useContext, useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { ContainerButton, Content } from './styles';
import { MapContext } from '../../../context/MapContext';

export function CountFruitDropDown({
  data, children, isDropdownVisible, handleVisibilityToggle,
}) {
  // const [isDropdownVisible, setIsVisibleDropdown] = useState(false);

  const { selectedFilters, setSelectedFilters } = useContext(MapContext);

  const allSelection = [
    { name: 'Fruta Madura', selected: true },
    { name: 'Fruta Verde', selected: true },
    { name: 'Madura Anomalia', selected: true },
    { name: 'Verde Anomalia', selected: true },
  ];

  useEffect(() => {
    const all = allSelection.map((e) => e.name);
    if (isDropdownVisible && selectedFilters.filter((i) => all.includes(i.name))) {
      setSelectedFilters((update) => [...update, ...allSelection]);
    } else if (!isDropdownVisible && selectedFilters.length !== 0) {
      setSelectedFilters((element) => element.filter((i) => !all.includes(i.name)));
    }
  }, [isDropdownVisible]);

  const handleToggle = () => {
    handleVisibilityToggle(!isDropdownVisible);
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <ContainerButton
        style={{
          ...(!!isDropdownVisible && {
            border: '2px solid #2B4976',
            color: '#fefefe',
            backgroundColor: '#2B4976',
          }),
          ...(data.disabled && {
            cursor: 'not-allowed',
            opacity: 0.2,
            pointerEvents: 'none',
          }),
        }}
        loading={data.loading}
        disabled={data.disabled}
        onClick={() => handleToggle()}
      >
        <span>{data.name}</span>
      </ContainerButton>

      {isDropdownVisible
        // && allSelection.every((item) => item.selected === true)
        && <Content>{children}</Content>}
    </div>
  );
}

CountFruitDropDown.propTypes = {
  data: PropTypes.node,
  children: PropTypes.node,
}.isRequired;
