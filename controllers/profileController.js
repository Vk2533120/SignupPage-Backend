const Profile = require('../models/Profile');


exports.getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.userId }).select('-__v -createdAt -updatedAt');

        if (!profile) {
           
            return res.status(404).json({ message: 'Profile not found.' });
        }

        res.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: 'Server error while fetching profile details.' });
    }
};

/**
 * @desc Update user profile details
 * @route PUT /api/profile
 * @access Private (Requires JWT token)
 */
exports.updateProfile = async (req, res) => {
    // Extract fields that can be updated from the request body
    const { age, dob, contact } = req.body;
    
    // Create an object with the fields we want to update
    const updateFields = {};
    if (age !== undefined) updateFields.age = age;
    if (dob !== undefined) updateFields.dob = dob;
    if (contact !== undefined) updateFields.contact = contact;

    try {
        // Find the profile linked to the logged-in user and update it.
        // We use findOneAndUpdate to ensure atomic update and return the updated document.
        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: req.userId }, // Filter by the authenticated user's ID
            { $set: updateFields }, // Apply the updates
            { new: true, runValidators: true } // Return the new document, run schema validators
        ).select('-__v -createdAt -updatedAt'); // Exclude metadata fields

        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found and could not be updated.' });
        }

        res.json({ 
            message: 'Profile updated successfully!', 
            profile: updatedProfile 
        });

    } catch (error) {
        // Handle MongoDB validation errors (e.g., if age is not a number)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error("Error updating profile:", error);
        res.status(500).json({ message: 'Server error while updating profile details.' });
    }
};