import React, { useState, useEffect, useRef } from 'react';
import { State } from '../helpers/creationReducer';
import Draggable, { DraggableEvent } from 'react-draggable';
import creation from '../../assets/images/creation.jpg';
import creation2x from '../../assets/images/creation@2x.jpg';

type DraggableData = {
	node: HTMLElement;
	// lastX + deltaX === x
	x: number;
	y: number;
	deltaX: number;
	deltaY: number;
	lastX: number;
	lastY: number;
};

type DraggableEventHandler = (e?: Event, data?: DraggableData) => void | false;

interface ICreationSubmit {
	state: State;
	dispatch: React.Dispatch<any>;
}

export const CreationSubmit = ({ state, dispatch }: ICreationSubmit) => {
	const scaleRef = useRef(null);
	const toggleRef = useRef(null);

	const [boundRight, setBoundRight] = useState<number>(0);

	useEffect(() => {
		const scale: HTMLDivElement = scaleRef.current;
		const toggle: HTMLDivElement = toggleRef.current;

		const paddingLeft: number = parseInt(getComputedStyle(scale)['padding-left']);
		const paddingRight: number = parseInt(getComputedStyle(scale)['padding-right']);

		const scaleWidth: number = scale.clientWidth - (paddingLeft + paddingRight);

		const toggleWidth: number = toggle.clientWidth;

		const bound: number = scaleWidth - toggleWidth;

		setBoundRight(bound);
	}, []);

	const handleToggleStop = (e: DraggableEvent, data: DraggableData): void => {
		const currentPosition: number = Math.ceil(data.x);

		if (currentPosition >= boundRight) {
			console.log('swiped');
			// TODO: Here must be a function that sends filled form of nft creation
		}
	};

	return (
		<div className="step">
			<div className="step-submit">
				<div className="step-submit__img">
					<img
						width="470"
						height="307"
						src={creation}
						srcSet={creation2x ? `${creation} 1x, ${creation2x} 2x` : null}
						alt=""
					/>
				</div>
				<div className="step-submit-content">
					<h3 className="title title_size-s step-submit-content__title">Perfect!</h3>
					<p className="title title_size-xs">Swipe right to create IMMA NFT</p>
					<div className="slider-wrapper">
						<div className="slider-field" ref={scaleRef}>
							<span className="slider-field__placeholder">
								Create IMMA NFT
								<svg
									width="26"
									height="10"
									viewBox="0 0 26 10"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M0 5.04736H25M25 5.04736L20.2381 0.547363M25 5.04736L20.2381 9.54736"
										stroke="white"
										strokeOpacity="0.5"
									/>
								</svg>
							</span>
							<Draggable
								axis="x"
								bounds={{ top: 0, left: 0, right: boundRight, bottom: 0 }}
								onStop={(evt, data) => handleToggleStop(evt, data)}
							>
								<div className="slider-toggle" ref={toggleRef}></div>
							</Draggable>
						</div>
						<button
							type="button"
							className="slider-clean"
							onClick={() => dispatch({ type: 'CLEAN_FORM' })}
						>
							<svg
								width="20"
								height="21"
								viewBox="0 0 20 21"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M7.5 7.77051H8.75V15.2705H7.5V7.77051ZM11.25 7.77051H12.5V15.2705H11.25V7.77051Z"
									fill="#B8B8B8"
								/>
								<path
									d="M2.5 4.02051V5.27051H3.75V17.7705C3.75 18.102 3.8817 18.42 4.11612 18.6544C4.35054 18.8888 4.66848 19.0205 5 19.0205H15C15.3315 19.0205 15.6495 18.8888 15.8839 18.6544C16.1183 18.42 16.25 18.102 16.25 17.7705V5.27051H17.5V4.02051H2.5ZM5 17.7705V5.27051H15V17.7705H5ZM7.5 1.52051H12.5V2.77051H7.5V1.52051Z"
									fill="#B8B8B8"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
