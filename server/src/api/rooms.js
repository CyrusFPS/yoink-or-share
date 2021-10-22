const express = require('express');
const Room = require('../models/room');
const User = require('../models/user');

const router = express.Router();

const createOneRoom = async (user) => {
  const discordUsername = `${user.username}#${user.discriminator}`;

  const newRoom = await new Room({
    users: [],
    whitelist: [discordUsername],
    owner: discordUsername
  }).save();

  const newUser = await User.findOneAndUpdate({ discordID: user.discordID }, { room: newRoom.id });

  return { newRoom, newUser };
};

const findOneRoom = async (id) => {
  try {
    const result = await Room.findById(id);
    return result;
  } catch (error) {
    return false;
  }
}

const deleteOneRoom = async (id, owner) => {
  const room = await Room.findById(id);

  if (room.owner === `${owner.username}#${owner.discriminator}`) {
    await Room.findByIdAndDelete(id);
    await User.findOneAndUpdate({ discordID: owner.discordID }, { room: null });
    return true;
  } else {
    return false;
  }
};

const roomPermsCheck = (room, user) => {
  const discordUsername = `${user.username}#${user.discriminator}`;

  if (room.whitelist.includes(discordUsername)) return true;
  return false;
}

const updateOneRoom = async (id, newRoom, user) => {
  const oldRoom = await Room.findById(id);
  
  if (oldRoom.owner === `${user.username}#${user.discriminator}`) {
    const updatedRoom = await Room.findByIdAndUpdate(id, newRoom);

    if (updatedRoom) return updatedRoom;
    return false;
  } else {
    return false;
  }
};

router.post('/rooms/create', async (req, res) => {
  const user = req.body.user;

  if (user.room) return res.json({ message: "User already owns an open room" });

  const newStuff = await createOneRoom(user);
  console.log(newStuff);
  res.json({ room: newStuff.newRoom, user: newStuff.newUser });
});

router.get("/rooms/:id", async (req, res) => {
  const room = await findOneRoom(req.params.id);
  const userHasPerms = roomPermsCheck(room, req.user);

  if (userHasPerms) {
    if (room) {
      res.status(200).json({
        status: "success",
        room
      });
    } else {
      res.status(410).json({
        status: "failed",
        message: "no room found"
      })
    }
  } else {
    res.status(400).json({
      status: "failed",
      message: "user doesn't have perms to join room"
    })
  }
});

router.delete('/rooms/:id', async (req, res) => {
  const id = req.params.id
  const user = req.body;

  const result = await deleteOneRoom(id, user);

  if (result) {
    res.status(200).json({
      status: "success",
    });
  } else {
    res.status(400).json({
      status: "failed",
      message: "user lacks permissions"
    });
  }
});

module.exports = router;