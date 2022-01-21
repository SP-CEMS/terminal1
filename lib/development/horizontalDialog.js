/******/ (function (modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/ var installedModules = {}; // The require function
	/******/
	/******/ /******/ function __webpack_require__(moduleId) {
		/******/
		/******/ // Check if module is in cache
		/******/ if (installedModules[moduleId]) {
			/******/ return installedModules[moduleId].exports;
			/******/
		} // Create a new module (and put it into the cache)
		/******/ /******/ var module = (installedModules[moduleId] = {
			/******/ i: moduleId,
			/******/ l: false,
			/******/ exports: {},
			/******/
		}); // Execute the module function
		/******/
		/******/ /******/ modules[moduleId].call(
			module.exports,
			module,
			module.exports,
			__webpack_require__
		); // Flag the module as loaded
		/******/
		/******/ /******/ module.l = true; // Return the exports of the module
		/******/
		/******/ /******/ return module.exports;
		/******/
	} // expose the modules object (__webpack_modules__)
	/******/
	/******/
	/******/ /******/ __webpack_require__.m = modules; // expose the module cache
	/******/
	/******/ /******/ __webpack_require__.c = installedModules; // identity function for calling harmony imports with the correct context
	/******/
	/******/ /******/ __webpack_require__.i = function (value) {
		return value;
	}; // define getter function for harmony exports
	/******/
	/******/ /******/ __webpack_require__.d = function (exports, name, getter) {
		/******/ if (!__webpack_require__.o(exports, name)) {
			/******/ Object.defineProperty(exports, name, {
				/******/ configurable: false,
				/******/ enumerable: true,
				/******/ get: getter,
				/******/
			});
			/******/
		}
		/******/
	}; // getDefaultExport function for compatibility with non-harmony modules
	/******/
	/******/ /******/ __webpack_require__.n = function (module) {
		/******/ var getter =
			module && module.__esModule
				? /******/ function getDefault() {
						return module['default'];
				  }
				: /******/ function getModuleExports() {
						return module;
				  };
		/******/ __webpack_require__.d(getter, 'a', getter);
		/******/ return getter;
		/******/
	}; // Object.prototype.hasOwnProperty.call
	/******/
	/******/ /******/ __webpack_require__.o = function (object, property) {
		return Object.prototype.hasOwnProperty.call(object, property);
	}; // __webpack_public_path__
	/******/
	/******/ /******/ __webpack_require__.p = ''; // Load entry module and return exports
	/******/
	/******/ /******/ return __webpack_require__((__webpack_require__.s = 0));
	/******/
})(
	/************************************************************************/
	/******/ [
		/* 0 */
		/***/ function (module, exports, __webpack_require__) {
			'use strict';

			/**
			 * @file index.js
			 * Contains code that registers a dialog popup component.
			 */

			/* global AFRAME */
			if (typeof AFRAME === 'undefined') {
				throw new Error(
					'Component attempted to register before AFRAME was available.'
				);
			}
			/**
			 * Dialog Popup component for A-Frame.
			 */

			AFRAME.registerComponent('dialog-popup', {
				schema: {
					title: {
						type: 'string',
						default: 'New Dialog',
					},
					titleColor: {
						type: 'string',
						default: 'black',
					},
					titleFont: {
						type: 'string',
						default: 'assets/raleway.json',
					},
					titleWrapCount: {
						type: 'number',
						default: 24,
					},
					body: {
						type: 'string',
						default: '',
					},
					bodyColor: {
						type: 'string',
						default: 'black',
					},
					bodyFont: {
						type: 'string',
						default: 'assets/raleway.json',
					},
					bodyWrapCount: {
						type: 'number',
						default: 30,
					},
					openOn: {
						type: 'string',
						default: 'mouseenter',
					},
					active: {
						type: 'boolean',
						default: true,
					},
					openIconImage: {
						type: 'asset',
						default: 'assets/plus.png',
					},
					openIconRadius: {
						type: 'number',
						default: 0.5,
					},
					openIconColor: {
						type: 'string',
						default: 'white',
					},
					closeIconImage: {
						type: 'asset',
						default: '',
					},
					closeIconRadius: {
						type: 'number',
						default: 0.3,
					},
					closeIconColor: {
						type: 'string',
						default: 'white',
					},
					image: {
						type: 'string',
						default: '',
					},
					imageWidth: {
						type: 'number',
						default: 3,
					},
					imageHeight: {
						type: 'number',
						default: 3,
					},
					dialogBoxWidth: {
						type: 'number',
						default: 5,
					},
					dialogBoxHeight: {
						type: 'number',
						default: 2.5,
					},
					dialogBoxColor: {
						type: 'string',
						default: 'white',
					},
					dialogBoxPadding: {
						type: 'number',
						default: 0.2,
					},
					previousDialog: {
						type: 'string',
						default: '',
					},
					multiple: {
						type: 'boolean',
						default: false,
					},
					addImage: {
						type: 'string',
						default: '',
					},
				},
				multiple: true,
				dialogPlaneEl: null,
				openIconEl: null,
				closeIconEl: null,
				titleEl: null,
				bodyEl: null,
				imageEl: null,
				hasImage: false,

				/**
				 * Spawns the entities required to support this dialog.
				 */
				init: function init() {
					this.cameraEl = document.querySelector('[camera]');
					this.spawnEntities();
					this.el.emit('loaded');
				},

				/**
				 * If the component is open, ensure it always faces the camera.
				 */
				tick: function tick() {
					if (this.isOpen) {
						this.positionDialogPlane();
					}
				},

				/**
				 * When this component is removed, destruct event listeners.
				 */
				remove: function remove() {
					var openOn = this.data.openOn;
					this.openIconEl.removeEventListener(
						openOn,
						this.toggleDialogOpen.bind(this)
					);
					this.closeIconEl.removeEventListener(
						openOn,
						this.toggleDialogOpen.bind(this)
					);
				},

				/**
				 * When this component is updated, re-calculate title, body, image, and
				 * dialog plane to incorporate changes.
				 */
				update: function update() {
					this.generateTitle();
					this.generateBody();
					this.generateImage();
				},

				/**
				 * Handles opening and closing the dialog plane.
				 */

				/**
				 * Generates the open icon.
				 */
				generateClickAnimation: function generateClickAnimation() {
					var _this$data7 = this.data,
						value = _this$data7.title,
						body = _this$data7.body,
						src = _this$data7.image,
						addImage = _this$data7.addImage;
					var an = document.createElement('a-entity');
					an.setAttribute('geometry', 'primitive:plane;width:0.6;height:0.6;');
					an.setAttribute(
						'material',
						'shader:gif;src:url(assets/click-animation.gif);transparent:true;alphaTest:0.5;'
					);
					an.classList.add('clickOnce');
					an.setAttribute('rotation', '0 0 30');
					an.setAttribute('position', '2 -0.8 0.01');
					an.setAttribute('scale', '2 2 2');
					an.addEventListener('mouseenter', function hoverAns() {
						$('.a-canvas.a-grab-cursor:hover').css('cursor', 'pointer');
					});
					an.addEventListener('mouseleave', function hoverAns() {
						$('.a-canvas.a-grab-cursor:hover').css('cursor', 'grab');
					});
					an.addEventListener('mousedown', function () {
						var elContainer = document.createElement('div');
						var leftSide = document.createElement('div');
						var rightSide = document.createElement('div');
						var itemtitle = document.createElement('p');
						var itembody = document.createElement('p');
						var itemImg = document.createElement('img');

						itemtitle.innerHTML = value;
						itembody.innerHTML = body.replace(/\\n/g, '<br />');
						itemImg.classList.add('itemImg');
						leftSide.classList.add('leftPopup');
						rightSide.classList.add('rightPopup');
						itemtitle.classList.add('itemTitle');
						itembody.classList.add('itemBody');
						elContainer.classList.add('elcontainer');
						if (window.innerHeight > window.innerWidth) {
							if (itembody.innerHTML == '') {
								rightSide.style.cssText =
									'width:80%;height:40%;background:white;border-radius: 0 0 10px 10px;display:flex;justify-content:center;flex-direction:column;';
							}
						} else {
							if (itembody.innerHTML == '') {
								rightSide.style.cssText =
									'width:40%;height:80%;background:white;border-radius: 0 10px 10px 0;display:flex;justify-content:center;flex-direction:column;';
							}
						}
						itemImg.src = src;

						elContainer.classList.add('imgPopup');
						leftSide.appendChild(itemImg);
						rightSide.appendChild(itemtitle);
						rightSide.appendChild(itembody);
						if (addImage) {
							var image = document.createElement('img');
							image.src = addImage;
							image.classList.add('itemImage');
							rightSide.appendChild(image);
						}
						elContainer.appendChild(leftSide);
						elContainer.appendChild(rightSide);
						elContainer.onmousedown = function () {
							var imgPopup = document.querySelectorAll('.imgPopup');
							for (let x = 0; x < imgPopup.length; x++) {
								$(imgPopup[x].remove());
							}
						};
						document.body.appendChild(elContainer);
						var clickOnce = document.querySelectorAll('.clickOnce');
						clickOnce.forEach((element) => {
							$(element).remove();
						});
					});
					return an;
				},
				generateOpenIcon: function generateOpenIcon() {
					var _this$data = this.data,
						radius = _this$data.openIconRadius,
						color = _this$data.openIconColor,
						src = _this$data.openIconImage,
						openOn = _this$data.openOn,
						after = _this$data.previousDialog,
						multiple = _this$data.multiple,
						value = _this$data.title,
						body = _this$data.body,
						addImage = _this$data.addImage,
						imageSrc = _this$data.image;

					var idname = this.el.getAttribute('id');
					var openIcon = document.createElement('a-entity');
					var pulseIcon = document.createElement('a-entity');
					var pos = this.el.getAttribute('position');
					openIcon.setAttribute(
						'id',
						''.concat(this.el.getAttribute('id'), '--open-icon')
					);
					openIcon.setAttribute('position', Object.assign({}, pos));
					pulseIcon.setAttribute('position', Object.assign({}, pos));
					openIcon.setAttribute('geometry', {
						primitive: 'circle',
						radius: radius,
					});

					// If the parent entity has aa look-at component attached, apply the look-at
					// component to the openIcon.
					//openIcon.classList.add('removeIcon');
					openIcon.classList.add('dialogIcon');

					if (multiple) {
						pulseIcon.setAttribute('id', ''.concat(idname, '--pulse-icon'));

						pulseIcon.setAttribute('geometry', {
							primitive: 'circle',
							radius: radius + 0.01,
						});
						pulseIcon.setAttribute('material', {
							src: 'assets/pulse.png',
							transparent: 'true',
						});
						pulseIcon.classList.add('removePulse');
						var matches = idname.match(/(\d+)/);

						let iconSrc = 'assets/question'.concat(matches[0], '.png');

						openIcon.setAttribute('material', {
							color: color,
							src: iconSrc,
						});
						pulseIcon.setAttribute(
							'animation__scale',
							'property: scale; to: 1.2 1.2 1; loop: true;'
						);
						openIcon.classList.add('changeIcon');
						if (after) {
							openIcon.classList.add('invis');
							pulseIcon.classList.add('invis');

							openIcon.setAttribute('visible', 'false');
							pulseIcon.setAttribute('visible', 'false');
						}
					} else {
						openIcon.setAttribute('material', {
							color: color,
							src: src,
						});
					}
					openIcon.setAttribute('material', {
						shader: 'flat',
					});
					pulseIcon.setAttribute('material', {
						shader: 'flat',
					});
					openIcon.classList.add('openChecker');

					pulseIcon.setAttribute('look-at', '#cam');
					openIcon.setAttribute('look-at', '#cam');
					$(window).on('load', function () {
						if (AFRAME.utils.device.isMobile()) {
							openIcon.addEventListener('mousedown', function () {
								openPlane();
							});
							pulseIcon.addEventListener('mousedown', function () {
								openPlane();
							});
						} else {
							openIcon.addEventListener('mouseenter', function () {
								openPlane();
							});
							pulseIcon.addEventListener('mouseenter', function () {
								openPlane();
							});
						}
					});
					function openPlane() {
						//var removeIcon = $('.removeIcon');
						//var removePulse = $('.removePulse');
						if (AFRAME.utils.device.isMobile()) {
							var elContainer = document.createElement('div');
							var leftSide = document.createElement('div');
							var rightSide = document.createElement('div');
							var itemtitle = document.createElement('p');
							var itembody = document.createElement('p');
							var itemImg = document.createElement('img');

							itemtitle.innerHTML = value;
							itembody.innerHTML = body.replace(/\\n/g, '<br />');
							itemImg.classList.add('itemImg');
							leftSide.classList.add('leftPopup');
							rightSide.classList.add('rightPopup');
							itemtitle.classList.add('itemTitle');
							itembody.classList.add('itemBody');
							elContainer.classList.add('elcontainer');
							if (window.innerHeight > window.innerWidth) {
								if (itembody.innerHTML == '') {
									itemImg.style.cssText =
										'width:80%;height:40%;background:white;border-radius: 0 0 0 0;display:flex;justify-content:center;flex-direction:column;';
								}
							} else {
								if (itembody.innerHTML == '') {
									itemImg.style.cssText =
										'width:40%;height:80%;background:white;border-radius: 0 0 0 0;display:flex;justify-content:center;flex-direction:column;';
								}
							}
							itemImg.src = imageSrc;

							elContainer.classList.add('imgPopup');
							leftSide.appendChild(itemImg);
							rightSide.appendChild(itemtitle);
							rightSide.appendChild(itembody);
							if (addImage) {
								var image = document.createElement('img');
								image.src = addImage;
								image.classList.add('itemImage');
								rightSide.appendChild(image);
							}
							elContainer.appendChild(leftSide);
							elContainer.appendChild(rightSide);
							elContainer.onmousedown = function () {
								var imgPopup = document.querySelectorAll('.imgPopup');
								for (let x = 0; x < imgPopup.length; x++) {
									$(imgPopup[x].remove());
								}
							};
							document.body.appendChild(elContainer);
							var clickOnce = document.querySelectorAll('.clickOnce');
							clickOnce.forEach((element) => {
								$(element).remove();
							});
						} else {
							var openChecker = $('.openChecker');
							var planeChecker = $('.planeChecker');
							document
								.getElementById(''.concat(idname, '--dialog-plane'))
								.setAttribute('visible', 'true');
							document
								.getElementById(''.concat(idname, '--dialog-plane'))
								.setAttribute(
									'animation__scale',
									'property: scale; to: 1 1 1; dur:200'
								);
							document
								.getElementById(''.concat(idname, '--open-icon'))
								.setAttribute('visible', 'false');
							for (let x = 0; x < openChecker.length; x++) {
								if (
									openChecker[x].getAttribute('id') !=
									idname.concat('--open-icon')
								) {
									openChecker[x].setAttribute('visible', 'true');
									planeChecker[x].setAttribute('visible', 'false');
								}
							}
							// for (let x = 0; x < removeIcon.length; x++) {
							// 	removeIcon[x].setAttribute('visible', 'false');
							// }
							// if (removePulse) {
							// 	for (let x = 0; x < removePulse.length; x++) {
							// 		removePulse[x].setAttribute('visible', 'false');
							// 	}
							// }
						}
					}

					this.openIconEl = openIcon;

					return [openIcon, pulseIcon];
				},

				/**
				 * Generates the close icon.
				 */
				generateCloseIcon: function generateCloseIcon() {
					var _this$data2 = this.data,
						radius = _this$data2.closeIconRadius,
						color = _this$data2.closeIconColor,
						src = _this$data2.closeIconImage,
						width = _this$data2.dialogBoxWidth,
						height = _this$data2.dialogBoxHeight,
						openOn = _this$data2.openOn;
					var closeIcon = document.createElement('a-entity');
					closeIcon.setAttribute(
						'id',
						''.concat(this.el.getAttribute('id'), '--close-icon')
					);
					closeIcon.setAttribute('position', {
						x: width / 2,
						y: height / 2,
						z: 0.01,
					});
					closeIcon.setAttribute('geometry', {
						primitive: 'circle',
						radius: radius,
					});
					closeIcon.setAttribute('material', {
						color: color,
						src: src,
					});
					closeIcon.addEventListener(openOn, this.toggleDialogOpen.bind(this));
					this.closeIconEl = closeIcon;
					return closeIcon;
				},

				/**
				 * Generates the title text.
				 */
				generateTitle: function generateTitle() {
					var _this$data3 = this.data,
						value = _this$data3.title,
						color = _this$data3.titleColor,
						font = _this$data3.titleFont,
						wrapCount = _this$data3.titleWrapCount,
						width = _this$data3.dialogBoxWidth,
						height = _this$data3.dialogBoxHeight,
						padding = _this$data3.dialogBoxPadding,
						body = _this$data3.body,
						imageHeight = _this$data3.imageHeight,
						multiple = _this$data3.multiple,
						src = _this$data3.image,
						addImage = _this$data3.addImage;
					var title = this.titleEl || document.createElement('a-entity');
					title.setAttribute(
						'id',
						''.concat(this.el.getAttribute('id'), '--title')
					);
					title.setAttribute('text', {
						value: value,
						color: '#456ab7',
						align: 'center',
						font: font,
						letterSpacing: -2,
						wrapCount: 16,
						width: 2,
						shader: 'msdf',
						baseline: 'top',
						anchor: 'center',
					});
					title.setAttribute(
						'geometry',
						'primitive: plane; width: auto; height: auto; '
					);
					if (multiple) {
						title.classList.add('clickTitle');
					}
					title.setAttribute('material', 'color: purple;visible:false;');
					var y = height / 2 - padding;

					if (this.hasImage) {
						y -= imageHeight / 2;
					}
					title.addEventListener('mouseenter', function hoverAns() {
						$('.a-canvas.a-grab-cursor:hover').css('cursor', 'pointer');
					});
					title.addEventListener('mouseleave', function hoverAns() {
						$('.a-canvas.a-grab-cursor:hover').css('cursor', 'grab');
					});
					title.setAttribute('position', {
						x: 1.16,
						y: 0,
						z: 0.01,
					});
					title.addEventListener('mousedown', function () {
						var elContainer = document.createElement('div');
						var leftSide = document.createElement('div');
						var rightSide = document.createElement('div');
						var itemtitle = document.createElement('p');
						var itembody = document.createElement('p');
						var itemImg = document.createElement('img');

						itemtitle.innerHTML = value;
						itembody.innerHTML = body.replace(/\\n/g, '<br />');
						leftSide.classList.add('leftPopup');
						rightSide.classList.add('rightPopup');
						itemtitle.classList.add('itemTitle');
						itembody.classList.add('itemBody');
						elContainer.classList.add('elcontainer');
						itemImg.classList.add('itemImg');
						if (window.innerHeight > window.innerWidth) {
							if (itembody.innerHTML == '') {
								rightSide.style.cssText =
									'width:80%;height:40%;background:white;border-radius: 0 0 20px 20px;display:flex;justify-content:center;flex-direction:column;';
							}
						} else {
							if (itembody.innerHTML == '') {
								rightSide.style.cssText =
									'width:40%;height:80%;background:white;border-radius: 0 20px 20px 0;display:flex;justify-content:center;flex-direction:column;';
							}
						}
						itemImg.src = src;

						elContainer.classList.add('imgPopup');
						leftSide.appendChild(itemImg);
						rightSide.appendChild(itemtitle);
						rightSide.appendChild(itembody);
						if (addImage) {
							var image = document.createElement('img');
							image.src = addImage;
							image.classList.add('itemImage');
							rightSide.appendChild(image);
						}
						elContainer.appendChild(leftSide);
						elContainer.appendChild(rightSide);
						elContainer.onmousedown = function () {
							var imgPopup = document.querySelectorAll('.imgPopup');
							for (let x = 0; x < imgPopup.length; x++) {
								$(imgPopup[x].remove());
							}
						};
						document.body.appendChild(elContainer);
						var clickOnce = document.querySelectorAll('.clickOnce');
						clickOnce.forEach((element) => {
							$(element).remove();
						});
					});

					this.titleEl = title;
					return title;
				},

				/**
				 * Generates the body text entity.
				 */
				generateBody: function generateBody() {
					var _this$data4 = this.data,
						value = _this$data4.body,
						color = _this$data4.bodyColor,
						font = _this$data4.bodyFont,
						wrapCount = _this$data4.bodyWrapCount,
						width = _this$data4.dialogBoxWidth,
						height = _this$data4.dialogBoxHeight,
						padding = _this$data4.dialogBoxPadding,
						imageHeight = _this$data4.imageHeight,
						multiple = _this$data4.multiple,
						src = _this$data4.image,
						title = _this$data4.title,
						addImage = _this$data4.addImage;

					var body = this.bodyEl || document.createElement('a-entity');
					body.setAttribute(
						'id',
						''.concat(this.el.getAttribute('id'), '--body')
					);
					value = '';

					body.setAttribute('text', {
						value: value,
						color: color,
						font: font,
						wrapCount: 40,
						shader: 'msdf',
						width: 2.3,
						baseline: 'center',
						anchor: 'center',
					});
					var y = height / 2 - padding * 3;
					body.addEventListener('mouseenter', function hoverAns() {
						$('.a-canvas.a-grab-cursor:hover').css('cursor', 'pointer');
					});
					body.addEventListener('mouseleave', function hoverAns() {
						$('.a-canvas.a-grab-cursor:hover').css('cursor', 'grab');
					});
					body.addEventListener('mousedown', function () {
						var elContainer = document.createElement('div');
						var leftSide = document.createElement('div');
						var rightSide = document.createElement('div');
						var itemtitle = document.createElement('p');
						var itembody = document.createElement('p');
						itemtitle.innerHTML = title;
						itembody.innerHTML = value.replace(/\\n/g, '<br />');
						leftSide.classList.add('leftPopup');
						rightSide.classList.add('rightPopup');
						itemtitle.classList.add('itemTitle');
						itembody.classList.add('itemBody');
						elContainer.classList.add('elcontainer');
						if (window.innerHeight > window.innerWidth) {
							if (itembody.innerHTML == '') {
								rightSide.style.cssText =
									'width:80%;height:40%;background:white;border-radius: 0 0 20px 20px;display:flex;justify-content:center;flex-direction:column;';
							}
						} else {
							if (itembody.innerHTML == '') {
								rightSide.style.cssText =
									'width:40%;height:80%;background:white;border-radius: 0 20px 20px 0;display:flex;justify-content:center;flex-direction:column;';
							}
						}
						leftSide.style.backgroundImage = 'url('.concat(src, ')');

						elContainer.classList.add('imgPopup');

						rightSide.appendChild(itemtitle);
						rightSide.appendChild(itembody);
						if (addImage) {
							var image = document.createElement('img');
							image.src = addImage;
							image.classList.add('itemImage');
							rightSide.appendChild(image);
						}
						elContainer.appendChild(leftSide);
						elContainer.appendChild(rightSide);
						elContainer.onmousedown = function () {
							var imgPopup = document.querySelectorAll('.imgPopup');
							for (let x = 0; x < imgPopup.length; x++) {
								$(imgPopup[x].remove());
							}
						};
						document.body.appendChild(elContainer);
						var clickOnce = document.querySelectorAll('.clickOnce');
						clickOnce.forEach((element) => {
							$(element).remove();
						});
					});

					if (this.hasImage) {
						y -= imageHeight / 2;
					}
					if (multiple) {
						body.classList.add('clickBody');
					}
					body.setAttribute('position', {
						x: 1.2,
						y: -0.1,
						z: 0.01,
					});

					this.bodyEl = body;
					return body;
				},

				/**
				 * Generates the image entity.
				 */
				generateImage: function generateImage() {
					var _this$data5 = this.data,
						src = _this$data5.image,
						width = _this$data5.imageWidth,
						height = _this$data5.imageHeight,
						dialogBoxHeight = _this$data5.dialogBoxHeight,
						multiple = _this$data5.multiple,
						title = _this$data5.title,
						body = _this$data5.body,
						addImage = _this$data5.addImage;

					if (!src.length) {
						return null;
					}
					var roundedPlane = document.createElement('a-rounded');
					roundedPlane.setAttribute('position', '-0.14 -1.14 0.001');
					roundedPlane.setAttribute('rounded', {
						height: 2.3,
						width: 2.5,
						topLeftRadius: 0,
						bottomLeftRadius: 0,
					});
					roundedPlane.setAttribute('material', {
						shader: 'flat',
					});

					roundedPlane.addEventListener('mouseenter', function hoverAns() {
						$('.a-canvas.a-grab-cursor:hover').css('cursor', 'pointer');
					});
					roundedPlane.addEventListener('mouseleave', function hoverAns() {
						$('.a-canvas.a-grab-cursor:hover').css('cursor', 'grab');
					});
					roundedPlane.addEventListener('mousedown', function () {
						var elContainer = document.createElement('div');
						var leftSide = document.createElement('div');
						var rightSide = document.createElement('div');
						var itemtitle = document.createElement('p');
						var itembody = document.createElement('p');
						var itemImg = document.createElement('img');
						itemtitle.innerHTML = title;
						itembody.innerHTML = body.replace(/\\n/g, '<br />');
						leftSide.classList.add('leftPopup');
						rightSide.classList.add('rightPopup');
						itemtitle.classList.add('itemTitle');
						itembody.classList.add('itemBody');
						elContainer.classList.add('elcontainer');
						itemImg.classList.add('itemImg');
						if (window.innerHeight > window.innerWidth) {
							if (itembody.innerHTML == '') {
								rightSide.style.cssText =
									'width:80%;height:40%;background:white;border-radius: 0 0 20px 20px;display:flex;justify-content:center;flex-direction:column;';
							}
						} else {
							if (itembody.innerHTML == '') {
								rightSide.style.cssText =
									'width:40%;height:80%;background:white;border-radius: 0 20px 20px 0;display:flex;justify-content:center;flex-direction:column;';
							}
						}
						itemImg.src = src;
						elContainer.classList.add('imgPopup');
						leftSide.appendChild(itemImg);
						rightSide.appendChild(itemtitle);
						rightSide.appendChild(itembody);
						if (addImage) {
							var image = document.createElement('img');
							image.src = addImage;
							image.classList.add('itemImage');
							rightSide.appendChild(image);
						}
						elContainer.appendChild(leftSide);
						elContainer.appendChild(rightSide);
						elContainer.onmousedown = function () {
							var imgPopup = document.querySelectorAll('.imgPopup');
							for (let x = 0; x < imgPopup.length; x++) {
								$(imgPopup[x].remove());
							}
						};
						document.body.appendChild(elContainer);
						var clickOnce = document.querySelectorAll('.clickOnce');
						clickOnce.forEach((element) => {
							$(element).remove();
						});
					});

					var image = this.imageEl || document.createElement('a-rounded');
					var idname = this.el.getAttribute('id');

					var matches = idname.match(/(\d+)/);
					image.setAttribute('rounded', {
						radius: 0.05,
						topRightRadius: 0,
						bottomRightRadius: 0,
						height: 0.99,
					});
					if (multiple) {
						image.setAttribute('order', matches[0]);
						image.classList.add('ansOrder');
						roundedPlane.classList.add('clickPlane');
					}
					image.setAttribute(
						'id',
						''.concat(this.el.getAttribute('id'), '--image')
					);
					image.addEventListener('mouseenter', function hoverAns() {
						$('.a-canvas.a-grab-cursor:hover').css('cursor', 'pointer');
					});
					image.addEventListener('mouseleave', function hoverAns() {
						$('.a-canvas.a-grab-cursor:hover').css('cursor', 'grab');
					});
					image.setAttribute('material', {
						src: src,
						height: height,
						width: width,
						shader: 'flat',
					});
					image.setAttribute('scale', '2.31 2.31 1');
					image.setAttribute('width', '1');
					image.setAttribute('position', {
						x: -2.37,
						y: -1.13,
						z: 0.02,
					});
					image.addEventListener('mousedown', function () {
						var elContainer = document.createElement('div');
						var leftSide = document.createElement('div');
						var rightSide = document.createElement('div');
						var itemtitle = document.createElement('p');
						var itembody = document.createElement('p');
						var itemImg = document.createElement('img');

						itemtitle.innerHTML = title;
						itembody.innerHTML = body.replace(/\\n/g, '<br />');
						itemImg.classList.add('itemImg');
						leftSide.classList.add('leftPopup');
						rightSide.classList.add('rightPopup');
						itemtitle.classList.add('itemTitle');
						itembody.classList.add('itemBody');
						elContainer.classList.add('elcontainer');
						if (window.innerHeight > window.innerWidth) {
							if (itembody.innerHTML == '') {
								rightSide.style.cssText =
									'width:80%;height:40%;background:white;border-radius: 0 0 20px 20px;display:flex;justify-content:center;flex-direction:column;';
							}
						} else {
							if (itembody.innerHTML == '') {
								rightSide.style.cssText =
									'width:40%;height:80%;background:white;border-radius: 0 20px 20px 0;display:flex;justify-content:center;flex-direction:column;';
							}
						}
						itemImg.src = src;

						elContainer.classList.add('imgPopup');
						leftSide.appendChild(itemImg);
						rightSide.appendChild(itemtitle);
						rightSide.appendChild(itembody);
						if (addImage) {
							var image = document.createElement('img');
							image.src = addImage;
							image.classList.add('itemImage');
							rightSide.appendChild(image);
						}
						elContainer.appendChild(leftSide);
						elContainer.appendChild(rightSide);
						elContainer.onmousedown = function () {
							var imgPopup = document.querySelectorAll('.imgPopup');
							for (let x = 0; x < imgPopup.length; x++) {
								$(imgPopup[x].remove());
							}
						};
						document.body.appendChild(elContainer);
						var clickOnce = document.querySelectorAll('.clickOnce');
						clickOnce.forEach((element) => {
							$(element).remove();
						});
					});

					this.hasImage = true;
					this.imageEl = image;
					return [image, roundedPlane];
				},

				/**
				 * Generates the dialog plane.
				 */
				generateDialogPlane: function generateDialogPlane() {
					var _this$data6 = this.data,
						width = _this$data6.dialogBoxWidth,
						height = _this$data6.dialogBoxHeight,
						padding = _this$data6.dialogBoxPadding,
						color = _this$data6.dialogBoxColor;
					var plane = this.dialogPlaneEl || document.createElement('a-entity');
					var idname = this.el.getAttribute('id');
					if (!AFRAME.utils.device.isMobile()) {
						plane.setAttribute(
							'id',
							''.concat(this.el.getAttribute('id'), '--dialog-plane')
						);
						plane.setAttribute('look-at', '#cam');
						var pos = Object.assign({}, this.el.getAttribute('position'));
						let posz = 0;
						if (pos.z > 0) {
							posz = pos.z - 0.5;
						} else {
							posz = pos.z + 0.5;
						}
						plane.setAttribute('position', {
							x: pos.x,
							y: pos.y,
							z: posz,
						});
						plane.setAttribute('visible', false);
						plane.setAttribute('scale', '0.3 0.3 1');
						plane.setAttribute('geometry', {
							primitive: 'plane',
							width: width + padding,
							height: height + padding,
						});
						var image = this.generateImage();
						plane.classList.add('planeChecker');

						if (image) {
							plane.appendChild(image[0]);
							plane.appendChild(image[1]);
						}

						plane.setAttribute('material', {
							color: color,
							src: 'assets/infoDialog.png',
							transparent: true,
							opacity: '0.5',
						});
						plane.appendChild(this.generateTitle());
						plane.appendChild(this.generateBody());
						plane.appendChild(this.generateClickAnimation());
						document
							.getElementById('skybox')
							.addEventListener('mouseenter', function () {
								var newEl = document.getElementById(
									''.concat(idname, '--open-icon')
								);
								if (!newEl.classList.contains('invis')) {
									document
										.getElementById(''.concat(idname, '--dialog-plane'))
										.setAttribute(
											'animation__scale',
											'property: scale; to: 0.3 0.3 1; dur:1;'
										);
									document
										.getElementById(''.concat(idname, '--dialog-plane'))
										.setAttribute('visible', 'false');
									newEl.setAttribute('visible', 'true');
								}
								var newPulse = document.getElementById(
									''.concat(idname, '--pulse-icon')
								);
								if (newPulse) {
									if (!newPulse.classList.contains('invis')) {
										newPulse.setAttribute('visible', 'true');
									}
								}
							});
					}
					this.dialogPlaneEl = plane;
					return plane;
				},
				positionDialogPlane: function positionDialogPlane() {
					if (this.dialogPlaneEl) {
						var vector = this.dialogPlaneEl.object3D.parent.worldToLocal(
							this.cameraEl.object3D.getWorldPosition()
						);
						this.dialogPlaneEl.object3D.lookAt(vector);
					}
				},
				spawnEntities: function spawnEntities() {
					let icons = this.generateOpenIcon();
					this.el.appendChild(icons[0]);
					this.el.appendChild(icons[1]);

					this.el.appendChild(this.generateDialogPlane());

					this.el.removeAttribute('position');
				},
			});

			/***/
		},
		/******/
	]
);
