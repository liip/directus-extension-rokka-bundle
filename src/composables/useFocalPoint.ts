const useFromImageCoordinates = (coordinate: number | undefined, range: number) => {
	// Set focal point to center if none defined
	if (coordinate === undefined) {
		return 0;
	}

	const valueAsUnitVector = coordinate / range;
	const valueInCorrectRange = valueAsUnitVector * 2 - 1;
	return valueInCorrectRange;
};

const useToImageCoordinates = (value: number, range: number) => {
	// Convert to range 0-1
	const valueAsUnitVector = (value + 1) / 2;
	// Clamp value, since library sometimes returns less than -1
	// do it after unit vector conversion, because
	// js floating point isnt accurate
	const valueClamped = Math.min(Math.max(valueAsUnitVector, 0), 1);

	// Round to get Integer
	return Math.floor(valueClamped * range);
};

export { useFromImageCoordinates, useToImageCoordinates };
