/*
  # Add Conversations Table and Update Messages Policies

  1. New Table
    - conversations
      - Links brands and creators
      - Tracks conversation metadata
    
  2. Security
    - Update RLS policies for messages
    - Ensure users can only access their own conversations
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES users(id) NOT NULL,
  creator_id uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(brand_id, creator_id)
);

-- Enable RLS on conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Add conversation_id to messages table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'conversation_id'
  ) THEN
    ALTER TABLE messages 
    ADD COLUMN conversation_id uuid REFERENCES conversations(id);
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_brand_id ON conversations(brand_id);
CREATE INDEX IF NOT EXISTS idx_conversations_creator_id ON conversations(creator_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- Update messages policies
DROP POLICY IF EXISTS "Users can read their messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

-- Policies for conversations
CREATE POLICY "Users can access their conversations"
  ON conversations
  FOR ALL
  TO authenticated
  USING (
    brand_id = auth.uid() OR creator_id = auth.uid()
  );

-- Policies for messages
CREATE POLICY "Users can access conversation messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (c.brand_id = auth.uid() OR c.creator_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (c.brand_id = auth.uid() OR c.creator_id = auth.uid())
    )
  );

CREATE POLICY "Users can update message read status"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid())
  WITH CHECK (receiver_id = auth.uid());

-- Function to update conversation timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for conversation timestamp update
DROP TRIGGER IF EXISTS update_conversation_timestamp ON messages;
CREATE TRIGGER update_conversation_timestamp
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Function to get unread message count
CREATE OR REPLACE FUNCTION get_unread_count(conversation_id uuid, user_id uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM messages
    WHERE messages.conversation_id = $1
    AND receiver_id = $2
    AND read = false
  );
END;
$$ LANGUAGE plpgsql;