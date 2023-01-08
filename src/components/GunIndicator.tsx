import React from "react";

const GunIndicator = ({ available, full, isReloading }: { available: number; full: number; isReloading?: boolean }) => {
	return (
		<>
			{/* <div className="gun__head">
				<p className="gun__title">Big machine gun from ww2</p>
			</div> */}
			<div className="gun__body">
				<div className="gun__icon">
					<div className="gun__icon-background"></div>
					<img className="gun__icon-image" src="img/icons/gun.png" />
				</div>
				<div className="gun__info">
					<div className="gun__info-property">
						<p className="gun__info-property-name">In clip</p>
						<p className="gun__info-property-value" id="gun-prop-available">
							{isReloading ? "Reloading..." : available}
						</p>
					</div>
					<div className="gun__info-property">
						<p className="gun__info-property-name">All amo</p>
						<p className="gun__info-property-value" id="gun-prop-full">
							{full}
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default GunIndicator;
