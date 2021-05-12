

const resUser = (user) => {
    return {
        id: user.id,
        night_mode: user.nightMode,
        name: user.name,
        username: user.username,
        dob: user.dob,
        profilePhoto: user.profilePhoto,
        coverPhoto: user.coverPhoto,
        bio: user.bio,
        location: user.location,
        website: user.website,
        followers: user.followers,
        following: user.following,
        bookmarks: user.bookmarks,
        joined: user.createdAt,
        role: user.role
    }
}

module.exports = resUser