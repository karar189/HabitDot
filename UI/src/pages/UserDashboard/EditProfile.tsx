/* eslint-disable */
// @ts-nocheck

import React, { useState, useEffect } from "react";

import Pencil from "/assets/images/edit.webp";
import Popup from "../../components/Popup.js";
// import useUserChallenges from "../../hooks/useUserChallenges.js";
import useUserDetails from "../../hooks/useUserDetails.js";
import useUpdateUserDetails from "../../hooks/useEditUserDetails.js";
import { useNavigate } from "react-router-dom";
import useUploadImage from "../../hooks/useImageUpload.js";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import useUpdateCoverHex from "../../hooks/useColorPicker.js";
import ImageSelectionAndCrop from "../../components/ImageSelectionAndCrop.js";
import Cropper from 'react-easy-crop'
import { getCroppedImg } from "../../components/cropUtils.js";
const EditUserProfile = () => {
    const { userDetails, loading, error } = useUserDetails();
    const { updateCoverHex, loading: updatingCoverHex, error: updateCoverHexError, success: coverHexSuccess } = useUpdateCoverHex();
    const { uploadImage, loading: uploadingImage, error: uploadError, success: uploadSuccess, data } = useUploadImage();

    const { updateUserDetails, loading: updating, error: updateError, success } = useUpdateUserDetails();
    const navigate = useNavigate();
    const getRandomTag = () => Math.random().toString(36).substr(2, 8);
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [cropped, setCropped] = useState(0)
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCropped(croppedAreaPixels)
    }
    const [name, setName] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [coverHexCode, setCoverHexCode] = useState(userDetails?.User.CoverHexCode);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [tempColor, setTempColor] = useState(coverHexCode);
    const [profileImageUri, setProfileImageUri] = useState(null);
    const [profileSelect, setProfileSelect] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [color, setColor] = useColor("#561ecb");
    useEffect(() => {
        if (userDetails) {
            setName(userDetails.User.UserName);
            setAboutMe(userDetails.User.Bio);
            setCoverHexCode(userDetails.User.CoverHexCode);

            setProfileImageUri(userDetails.User.ProfilePicture || "any");
        }
    }, [userDetails]);
    const handleClosePopup = () => {
        setIsPopupVisible(false);
        navigate('/profile');
    };

    const onSelectImage = async () => {
        try {
            const croppedImage = await getCroppedImg(profileImageUri, cropped);
            console.log(croppedImage)
            setProfileImageUri(croppedImage);
            setProfileSelect(false)
            await uploadImage(croppedImage);
            navigate('/profile')
        } catch (error) {
            console.error("Image picking error:", error);
            alert("Image picking error", "An error occurred while picking the image. Please try again.");
        }

    }
    const pickImage = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) {
                alert("No image selected", "Please select an image to upload.");
                return;
            }

            // Prepare the file object for upload
            const uriParts = file.name.split('.');
            const fileType = uriParts[uriParts.length - 1];
            // const fileObj = {
            //     name: `photo.${fileType}`,
            //     type: file.type,
            //     file: file,
            // };
            // console.log(fileObj);
            setProfileSelect(true)
            // Optionally set the image URI for preview
            setProfileImageUri(URL.createObjectURL(file));

            // Upload the image
            // await uploadImage(profileImageUri);

        } catch (error) {
            console.error("Image picking error:", error);
            alert("Image picking error", "An error occurred while picking the image. Please try again.");
        }
    };

    // const uploadImage = async (file) => {
    //     // Your image upload logic here
    //     console.log('Uploading image', file);
    // };

    const handleConfirm = async () => {
        const updatedTag = getRandomTag();

        const updatedDetails = {
            UserName: name,
            Bio: aboutMe,
            Tag: updatedTag
        };

        await updateUserDetails(updatedDetails);
        setIsPopupVisible(true);
    };

    const handleCoverHexConfirm = async () => {

        // setIsPopupVisible(true)
        console.log(coverHexCode)
        await updateCoverHex(coverHexCode);
        setShowColorPicker(false);
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    if (loading) {
        return <p>loading...</p>;
    }

    if (error) {
        return (
            <div className="flex flex-col w-screen">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <>
                {
                    profileSelect ? <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg overflow-hidden w-full max-w-md">
                            <div className="py-4 text-center">
                                <h1 className="text-xl font-bold">Crop Image</h1>
                            </div>
                            <div className="relative" style={{ height: '500px' }}>
                                <Cropper
                                    image={profileImageUri}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={4 / 3}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    cropShape="rect"
                                    showGrid={false}
                                    zoomSpeed={0.5}
                                />
                            </div>
                            <div className="flex justify-center p-4">
                                <button onClick={onSelectImage} className="flex justify-center items-center py-[14px] px-[24px] w-[160px] h-[48px] border border-gray-300 rounded-full">
                                    <p className="h-[25px] font-inter font-bold text-[14px] text-gray-900">
                                        Confirm   </p>
                                </button>
                                <button onClick={handleCancel} className="flex justify-center items-center py-[14px] px-[24px] w-[160px] h-[48px] bg-black border border-gray-300 rounded-full">
                                    <p className="h-[25px] font-inter font-bold text-[14px] text-white">
                                        Cancel   </p>
                                </button>
                            </div>
                        </div>
                    </div>
                        :
                        <>



                            <div>

                                <div
                                    className="relative flex flex-col h-40 items-center p-4"
                                    style={{ backgroundColor: coverHexCode }}
                                >
                                    <img
                                        src={Pencil} // Ensure the Pencil image path is correct
                                        alt="Edit Icon"
                                        className="w-6 h-6 absolute top-1 right-1 cursor-pointer"
                                        onClick={() => setShowColorPicker(true)}
                                    />
                                    <div className="flex flex-col items-center mt-24">
                                        <div className="relative w-28 h-28">
                                            <img
                                                className="object-cover w-full h-full rounded-lg"
                                                src={profileImageUri}
                                                alt="Profile"
                                            />

                                            <label className="absolute bottom-1 right-1 w-6 h-6 cursor-pointer">
                                                <img
                                                    src={Pencil} // Ensure the Pencil image path is correct
                                                    alt="Edit Icon"
                                                    className="w-full h-full"
                                                />

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={pickImage}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        {/* <div className="text-[10px] mt-2 text-gray-600">
                          {userDetails?.User?.Email}
                      </div> */}
                                        <div className="flex flex-row items-center p-2">
                                            {/* <div className="text-xl font-bold text-center mr-2 h-[32px] text-gray-800">
            {userDetails?.User?.UserName}
          </div> */}
                                            {/* <div onClick={() => console.log("clicked")}>
            <img src={edit} alt="Copy Icon" style={{ width: 25, height: 25 }} />
          </div> */}
                                        </div>
                                    </div>
                                </div>
                                {showColorPicker && (
                                    <div className="w-full px-4 mt-20">
                                        <p className="text-xs font-semibold my-3">COVER HEX CODE</p>
                                        <ColorPicker color={color} onChange={(e) => {
                                            setColor(e)
                                            setCoverHexCode(e.hex)
                                        }} />
                                        <button
                                            onClick={handleCoverHexConfirm}
                                            className="flex flex-row justify-center items-center py-3 px-5 mt-4 bg-black border border-gray-300 rounded-full"
                                        >
                                            <span className="font-inter font-bold text-[14px] text-white">
                                                Confirm Color
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="w-full px-4 mt-20">
                                <p className="text-left text-xs font-semibold my-3">NAME</p>
                                <input
                                    className="border font-normal border-gray-300 rounded-lg py-3 px-5 w-full"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <p className="text-left text-xs font-semibold my-3">Email</p>
                                <p className="text-left border font-normal py-3 px-5 border-gray-300 rounded-lg">
                                    {userDetails?.User?.Email}
                                </p>

                                <p className="text-left text-xs font-semibold my-3">ABOUT ME</p>
                                <textarea
                                    className="border font-normal border-gray-300 rounded-lg py-3 px-5 h-20 text-justify w-full"
                                    value={aboutMe}
                                    onChange={(e) => setAboutMe(e.target.value)}
                                />
                            </div>


                            <div className="relative bottom-0 left-0 w-full flex justify-center items-center py-4" style={{ marginTop: '23%' }}>
                                <div className="flex flex-row justify-center items-start gap-2 w-[344px] h-[48px]">
                                    <button onClick={handleCancel} className="flex justify-center items-center py-[14px] px-[24px] w-[160px] h-[48px] border border-gray-300 rounded-full">
                                        <p className="h-[25px] font-inter font-bold text-[14px] text-gray-900">Cancel</p>
                                    </button>
                                    <button onClick={handleConfirm} className="flex justify-center items-center py-[14px] px-[24px] w-[160px] h-[48px] bg-black border border-gray-300 rounded-full">
                                        <p className="h-[25px] font-inter font-bold text-[14px] text-white">{updating ? 'Updating...' : 'Confirm'}</p>
                                    </button>
                                </div>
                            </div>



                            <div>
                                <Popup isVisible={isPopupVisible} onClose={handleClosePopup}>
                                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-xs mx-auto">
                                        <div className="flex items-center justify-center">
                                            {/* Replace with appropriate icon or text based on success or error */}
                                            {success && (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-12 w-12 text-green-500"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 2a8 8 0 100 16 8 8 0 000-16zm4.293 6.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414l3-3zM8 10a1 1 0 011-1h1a1 1 0 010 2H9a1 1 0 01-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                            {updateError && (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-12 w-12 text-red-500"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 2a8 8 0 100 16 8 8 0 000-16zm4.293 6.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414l3-3zM8 10a1 1 0 011-1h1a1 1 0 010 2H9a1 1 0 01-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                        <p className="mt-6 mb-2 text-center font-bold text-lg">
                                            {success ? 'User Details updated successfully!' : ''}
                                            {updateError ? `Error: ${updateError}` : ''}
                                        </p>
                                        <div className="w-full flex justify-center">
                                            <button
                                                className="py-3 px-6 bg-gray-200 text-gray-800 font-bold rounded-full hover:bg-gray-300 focus:outline-none"
                                                onClick={handleClosePopup}
                                            >
                                                Okay
                                            </button>
                                        </div>
                                    </div>
                                </Popup>
                            </div>

                        </>
                }
            </>

        </div>


    );
};

export default EditUserProfile;
