import * as grpc from '@grpc/grpc-js'
import { GrapevineerClient } from 'grapevineer/gen/ts/v1/grapevineer_grpc_pb'
import {
  GetFlowerMeaningByDateRequest,
  GetFlowerMeaningByDateResponse,
} from 'grapevineer/gen/ts/v1/flower_meaning_pb'
import { GetAllPlayersRequest, Player } from 'grapevineer/gen/ts/v1/player_pb'
import { GetWavFromTextRequest } from 'grapevineer/gen/ts/v1/voicevox_pb'
import { GetBoScriptRandomlyRequest } from 'grapevineer/gen/ts/v1/bo_pb'

const grpcClient = new GrapevineerClient(
  'grapevineer-grpc.fly.dev:443',
  grpc.credentials.createInsecure()
)

export const getAllPlayers = async () => {
  const request = new GetAllPlayersRequest()
  let players: Player[] = []

  return new Promise<Player[]>((resolve, reject) => {
    grpcClient.getAllPlayers(request, (err, response) => {
      if (err || response === null) {
        console.error(err)
        reject([])
      }
      players = [...response!.getPlayersList()]
      resolve(players)
    })
  })
}

export const getFlowerMeaningByDate = async (date?: string) => {
  const request = new GetFlowerMeaningByDateRequest()
  if (date != undefined) {
    request.setDate(date)
  }

  return new Promise<GetFlowerMeaningByDateResponse.AsObject | null>(
    (resolve, reject) => {
      grpcClient.getFlowerMeaningByDate(request, (err, response) => {
        if (err || response === null) {
          console.error(err)
          reject(null)
        }
        resolve(response?.toObject()!)
      })
    }
  )
}

// {
//   url: 'https://hananokotoba.com/t0605',
//   date: '0605',
//   sumamry: '6月5日の誕生花は「ダリア」「マリーゴールド」「ホタルブクロ」です。',
//   flowersList: [
//     {
//       name: 'ダリア',
//       hanakotoba: '西洋の花言葉',
//       originList: [Array],
//       imageSource: ''
//     },
//     {
//       name: 'ダリア',
//       hanakotoba: '西洋の花言葉',
//       originList: [Array],
//       imageSource: ''
//     }
//   ]
// }

// {
//   "url": "https://hananokotoba.com/t0605",
//   "date": "0605",
//   "sumamry": "6月5日の誕生花は「ダリア」「マリーゴールド」「ホタルブクロ」です。",
//   "flowers": [
//     {
//       "name": "ダリア",
//       "hanakotoba": "西洋の花言葉",
//       "origin": [
//         "花言葉と花名の由来",
//         "花言葉の「不安定」は、フランス革命後の政情の不安定な時期に栽培されていたことに由来します。その後、その花姿から「華麗」「優雅」といった花言葉も追加されます。また「移り気」は、ダリアへの興味を失ったナポレオンの后ジョゼフィーヌに由来するといわれま す。"
//       ]
//     },
//     {
//       "name": "ダリア",
//       "hanakotoba": "西洋の花言葉",
//       "origin": [
//         "花言葉と花名の由来",
//         "花言葉の「不安定」は、フランス革命後の政情の不安定な時期に栽培されていたことに由来します。その後、その花姿から「華麗」「優雅」といった花言葉も追加されます。また「移り気」は、ダリアへの興味を失ったナポレオンの后ジョゼフィーヌに由来するといわれま す。"
//       ]
//     }
//   ]
// }

export const getWavFromText = async (text: string, speakerId: number) => {
  const request = new GetWavFromTextRequest()
  request.setText(text)
  request.setSpeakerId(speakerId)

  return new Promise<Uint8Array | null>((resolve, reject) => {
    grpcClient.getWavFromText(request, (err, response) => {
      if (err || response === null) {
        console.error(err)
        reject(null)
      }
      resolve(response?.getAudioData_asU8()!)
    })
  })
}

export const getBoScriptRandomly = async () => {
  const request = new GetBoScriptRandomlyRequest()

  return new Promise<string | null>(
    (resolve, reject) => {
      grpcClient.getBoScriptRandomly(request, (err, response) => {
        if (err || response === null) {
          console.error(err)
          reject(null)
        }
        resolve(response?.getScript()!)
      })
    }
  )
}