let peerConnection; // source of truth for peer-peer connections

let localStream;
let remoteStream;

let servers = {
    iceServers: [
        {
            urls:['stun:stun1.1.google.com:19302','stun:stun2.1.google.com:19302' ]
        }
    ] 
}

let init = async() => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })


    document.getElementById('user-1').srcObject = localStream
}

let createOffer = async () => {
    peerConnection = new RTCPeerConnection(servers)

    remoteStream = new MediaStream()
    document.getElementById('user-2').srcObject = remoteStream


    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    })

    peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }


    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            document.getElementById('offer-SDP').value = JSON.stringify(peerConnection.localDescription)
        }
    }

    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    document.getElementById('offer-SDP').value = JSON.stringify(offer)
}

let createAnswer = async () => {
    peerConnection = new RTCPeerConnection(servers)

    remoteStream = new MediaStream()
    document.getElementById('user-2').srcObject = remoteStream


    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    })

    peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }


    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            document.getElementById('answer-SDP').value = JSON.stringify(peerConnection.localDescription)
        }
    }

    let offer = document.getElementById('offer-SDP').value
    if (!offer) return alert('retrieve offer form peer first...')
    
    offer = JSON.parse(offer)
    await peerConnection.setRemoteDescription(offer)

    let answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    document.getElementById('answer-SDP').value = JSON.stringify(answer)
}

let addAnswer = async () => {
    let answer = document.getElementById('answer-SDP').value
    if (!answer) return alert('retrieve answer form peer first...')

    answer = JSON.parse(answer)

    if (!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(answer)
    }
}

init()

document.getElementById('create-offer').addEventListener('click', createOffer) 
document.getElementById('create-answer').addEventListener('click', createAnswer) 
document.getElementById('add-answer').addEventListener('click', addAnswer) 