use std::collections::{HashMap, HashSet};

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
pub struct BlockId {}
pub type PeerId = String;

pub enum State {
    Commit(BlockId),
    Propose,
    PrevoteNil,
    PrevoteBlock(BlockId),
    PrecommitNil,
    PrecommitBlock(BlockId),
    NewRound,
}

pub enum Event {
    Precommit(PrecommitEvent),
    Prevote(PrevoteEvent),
    NewHeight(u32),
    Overtime,
}

pub struct PrecommitEvent {
    pub peer_id: PeerId,
    pub commit: BlockId,
}

pub struct PrevoteEvent {
    pub peer_id: PeerId,
    pub vote: BlockId,
}

pub struct Machine {
    pub state: State,
    pub total: u32,
    pub height: u32,
    pub ballot_box: BallotBox,
}

impl Machine {
    pub fn recv_event(&mut self, event: Event) {
        match &self.state {
            State::Commit(_) => match event {
                Event::NewHeight(h) => {
                    self.height = h;
                    self.state = State::Propose;
                }
                _ => {}
            },
            State::Propose => match event {
                Event::Prevote(e) => {
                    self.state = State::PrevoteBlock(e.vote);
                }
                Event::Overtime => self.state = State::PrevoteNil,
                _ => {}
            },
            State::PrevoteBlock(_) | State::PrevoteNil => match event {
                Event::Prevote(e) => {
                    self.ballot_box.vote(e.peer_id, e.vote);
                    if let Some(b) = self.ballot_box.get_result(self.get_threshold()) {
                        self.state = State::PrecommitBlock(b)
                    }
                }
                Event::Overtime => self.state = State::PrecommitNil,
                _ => {}
            },
            State::PrecommitBlock(_) | State::PrecommitNil => match event {
                Event::Precommit(e) => {
                    self.ballot_box.vote(e.peer_id, e.commit);
                    if let Some(b) = self.ballot_box.get_result(self.get_threshold()) {
                        self.state = State::Commit(b);
                    }
                }
                Event::Overtime => self.state = State::NewRound,
                _ => {}
            },
            State::NewRound => self.state = State::Propose,
        }
    }

    fn get_threshold(&self) -> u32 {
        self.total * 3 / 2
    }
}

pub struct BallotBox {
    inner: HashMap<BlockId, HashSet<PeerId>>,
}

impl BallotBox {
    pub fn vote(&mut self, peer_id: PeerId, block: BlockId) {
        match self.inner.get_mut(&block) {
            Some(set) => {
                set.insert(peer_id);
            }
            None => {
                self.inner.insert(block, HashSet::from([peer_id]));
            }
        }
    }

    pub fn clear(&mut self) {
        self.inner.clear()
    }

    pub fn get_result(&mut self, threshold: u32) -> Option<BlockId> {
        let result = self
            .inner
            .iter()
            .find(|(_, s)| s.len() as u32 > threshold)?;
        let res = result.0.clone();
        self.clear();
        Some(res)
    }
}
