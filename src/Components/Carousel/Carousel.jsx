// import React from "react";
// import icon_prev from '../../img/prev_icon.png'
// import icon_next from '../../img/icon__next.png'
// import { Row, Col, Carousel } from 'antd'
// import trash from '../../img/trashdelete_icon.svg'
// const SampleNextArrow = (props) => {

//   const { onClick } = props

//   return (
//     // <RightCircleFilled />
//     <img src={icon_next} alt="" className='icon icon_next_slider' onClick={onClick} />
//   )
// }
// const SamplePrevArrow = (props) => {
//   const { onClick } = props
//   return (
//     <img src={icon_prev} alt="" className='icon icon_prev_slider' onClick={onClick} />

//   )
// }
// const settings = {
//   nextArrow: <SampleNextArrow />,
//   prevArrow: <SamplePrevArrow />
// }

// const Carousell = ({ images, onRemoveImage }) => {

//   return (
//     <>
//       <Row justify="center" align={'center'} height={'100%'}>
//         <Col span={24} className='abcasdasd'>
//           <Carousel arrows {...settings}>


//             {images.map((images, index) => {
//               return (
//                 <div key={index} className="carousel-item">
//                   <img src={images} style={{ height: '100%', width: '100%', objectFit: 'contain' }} alt={`Image ${index + 1}`}></img>
//                   <button className="remove-button" onClick={() => onRemoveImage(index)}>
//                     <img src={trash} alt="" className="trash-icon icon" />
//                   </button>
//                 </div>
//               )
//             })}


//           </Carousel>
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default Carousell;
